---
title: "Redis: Pipelining, Transactions and Lua Scripts"
date: 2019-11-25
keywords: redis, pipelining, transaction, lua, scripts
author: rafaeleyng
excerpt: >
  Redis offers 3 ways of grouping commands: pipelining, transactions and Lua scripts. The subtleties of using one instead of the other are explored on this post.
---

Redis offers 3 ways of grouping commands: pipelining, transactions and Lua scripts. The subtleties of using one instead of the other are explored on this post, in terms of the benefits they present, their limitations and atomicity.

## Pipelining

Think of pipelining as purely an optimization for sending multiple commands at a lower computational cost. Is the simplest of the three and offers less guarantees.

Pipelining in Redis consists of sending multiple commands to the server in the same message, separating commands by newline. You can test this (assuming you have Redis running locally on default port 6379) with `printf "INCR x\r\nINCR x\r\n" | nc localhost 6379`. This sends a single message containing two commands, separated by newlines. It is sometimes referred as "batching" in some libraries. Note that there is no special commands to mark the start or the end of a pipeline. It is really just a bunch of commands grouped together.

The server buffers all the answers in memory and sends all at once when the pipeline is done. So the pipeline size must not be too big that the server will have to hold a lot of answers in memory. Using a few thousands of commands inside a pipeline is usually a good starting point.

### Benefits of pipelining

It provides two main benefits in terms of performance:
- batching several commands in a single message allows us to save multiple times the round trip time between the client and the Redis server
- it avoids context switching, both in the client and in the server. When the server or the client need to read from/write to the network, a syscall is made and an expensive context switch happens between user space and kernel space. If we send 10 messages, each with a single command, 10 context switches will happen. If we send a single message with 10 commands, it's likely that a single context switch will be needed.

### Atomicity of pipelining

It is worth knowing that the part of Redis that executes client commands is single-threaded. Also, that all commands in Redis are atomic, executed individually. This means that Redis doesn't stop any command half-way through its execution to execute another command. Every individual command that is started is finished without interleaving with other commands.

But **pipelining is not atomic**. Imagine that you have 2 clients talking to the same Redis server, and both send at the same time a pipeline consisting of 5 commands each. While is guaranteed that all commands from Client 1 pipeline will be executed in order, there is no guarantee that they won't be interleaved with commands from Client 2 pipeline.

This image shows one of the multiple possible interleavings between two concurrent pipelines being executed:

![pipelines interleaving](https://user-images.githubusercontent.com/4842605/69572324-ad031380-0fa2-11ea-9db2-12a5c6ac9e41.png)


This behavior shows that pipelining is non-blocking on the server. This means that even if a Client 1 has a huge and slow pipeline, other clients won't be blocked, because the commands from the other clients will be interleaved with the commands from Client 1 pipeline.

### Limitations of pipelining

The clients only gets the command's response after executing all the pipeline. So if a client sends a pipeline with 5 commands, it will receive at the end an array with the response for each command.

If some command fails, the pipeline continues and an error is returned at the end, as the response for that specific command (not for the whole pipeline). You can test it with `printf "SET name rafael\r\nINCR name\r\nGET name\r\n" | nc localhost 6379` (note the error on the second line, but the last command gets executed anyway):

```
+OK
-ERR value is not an integer or out of range
$6
rafael
```

So you cannot, inside a pipeline, read some value from Redis and use the value later in a command inside the same pipeline.

### When you should use pipelining

Use pipeline when (all of the bellow):
- you need performance
- you have several commands to send to the Redis server
- you don't need the response of a previous command as input for a subsequent command (because you only get all responses in the end).

---

## Transactions

Redis transactions have a different semantics than "transactions" in a RDBMS context.

Transactions in Redis are a mechanism for queuing commands, and later deciding whether we want to executed all of them (atomically) or give up and don't execute any command.

Unlike pipelines, pipelines use special commands to mark the beginning and the end of the transaction, and the server also can queue the commands from a transaction (so the client can send one at a time). So transactions are stateful on the server, it actually keeps track of an ongoing transaction. Besides that, some libraries prefer to buffer the commands client-side and send the whole transaction inside a pipeline for optimization.

A transaction works by issuing a `MULTI` command, then sending all the commands that compose the pipeline, and an `EXEC` or a `DISCARD` at the end.

### Benefits of transactions

If pipelining is used on the library, all the performance benefits from using pipeline will apply.

Transactions also provide a "check-and-set" with the `WATCH` command. Imagine the scenario:
- before the transaction, we read a value from key `my-key` and store it in our program
- we start the transaction with `MULTI`
- we queue commands inside the transaction, using the value read from key `my-key`
- we `EXEC` the transaction

In this scenario, we can use `WATCH` to avoid running the transaction with an old value of `my-key`, in the case that the value changed between we read it and we executed the transaction.

### Atomicity of transactions

**Transactions are atomic**. There is no interleaving of commands inside a transaction with commands from outside that transaction. The attention point is that transactions are blocking. If you have a client with a huge and slow transaction being executed, all other clients will have to wait to be served.

### Limitations of transactions

Like pipelining, using transactions we don't have the ability to use intermediate values for subsequent commands. We only get the whole list of responses at the end.

If an error happens in one of the commands, there are 2 possibilities:
- if it is a syntax error (like wrong number of arguments), it is detected while queuing the commands and the transaction won't even be executed.
- if it is a semantic error (like an operation on the wrong data type), it is only detected while executing the transaction, and (just like with pipelines), the error will be returned inside the list of responses, as the response for the specific command. But subsequent commands in the queue will be executed normally, and the transaction won't be aborted. This means that Redis doesn't have a rollback mechanism like traditional RDBMS.

### When you should use transactions

You should use transactions if (all of the bellow):
- you need atomic execution of commands
- you don't need intermediate values to compose subsequent commands

---

## Lua Scripts

Redis supports of scripts written in Lua. This is by far the method that opens more possibilities of the 3 presented here.

A Lua script is loaded on the Redis server and can be later invoked with parameters (using the `EVALSHA` command). You can also send the whole script on every invocation (with the `EVAL` command), but you should avoid doing this for performance reasons.

### Benefits of Lua scripts

Unlike with pipelining and transactions, in a Lua script we can manipulate intermediate results. It is, we can read a value from Redis using a command, store the result in a Lua variable, and later use the value in a command or even in some logic like an `if` statement. We can also execute inside a Lua script any Redis command that the server supports. In the following example we use parameters (both `KEYS` and `ARGV`), issue Redis commands, read intermediate values, and use values we've read in the script logic.

```lua
local key = KEYS[1]
local new = ARGV[1]

local current = redis.call('GET', key)
if (current == false) or (tonumber(new) < tonumber(current)) then
  redis.call('SET', key, new)
  return 1
else
  return 0
end
```

### Atomicity of Lua scripts

**Lua scripts are atomic**. Likewise transactions, they are blocking and can make other clients wait for a long time if the script is slow.

### Limitations of Lua scripts

While there is no limitations in terms of functionality of Lua scripts, it might be weird to use it to implement a huge pipeline with atomicity. In a pipeline we would add commands to the pipeline, going as far as thousands of commands. How to implement this with scripts? Either generate a script dynamically with the current commands, which would not perform well (because we could not reuse the script with `EVALSHA`), or make a loop inside the script and call it with a huge number (thousands) of parameters. I've never needed to do this, but just seems weird and I'm not sure it would work.

### When you should use Lua scripts

You should use Lua scripts if (all of the bellow):
- you need atomic execution of commands
- you need intermediate values to compose subsequent commands
- you need intermediate values to conditionally execute commands

---

## References

- https://redis.io/topics/pipelining
- https://redis.io/topics/transactions
- https://redis.io/commands/eval
- https://www.slideshare.net/RedisLabs/atomicity-in-redis-thomas-hunter
- https://stackoverflow.com/questions/29327544/pipelining-vs-transaction-in-redis
- https://stackexchange.github.io/StackExchange.Redis/PipelinesMultiplexers
- https://stackexchange.github.io/StackExchange.Redis/Transactions
