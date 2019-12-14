---
title: "Redis: Replication and Partitioning"
date: 2019-11-25
keywords: redis, replication, partitioning, distributed system
author: rafaeleyng
excerpt: >
  Replication and partitioning are techniques that build the foundation of using Redis as a distributed system, and prepare the way for more complex abstractions like Redis Sentinel and Redis Cluster
---

Replication and partitioning are techniques that build the foundation of using Redis as a distributed system. In this post they will be examined as very basic building blocks. For more complex needs, there are more complex abstractions, like Redis Sentinel and Redis Cluster, that build upon these building blocks.

## Replication

Replication means keeping multiple copies of the same data, so in case we lose one of the copies, we still can recover the data from the other copies. Here we will analyze Redis replication at its most basic level.

Redis provides a basic *leader follower* replication, allowing us to have a master-replica setup. We can have one or multiple replicas for some master. This is done on the configuration file of the replica instances, using the configuration:

```
replicaof "my-master-hostname" "6379"
```

If you are using authentication on your Redis setup, you'll need some extra configuration to specify the password.

Once the configuration is done, each replica will stay connected to the master and receive from the master a stream of commands to create its own local copy of the dataset.

### Benefits of replication

This basic replication setup has the immediate benefit of improving data safety. If you happen to lose the data on your master, you still can recover the data from your replicas. (only what was already sent to the replicas before the failure) If a replica fails or loses connection to the master, it will automatically resynchronize its data with the master once the connection is recovered. So it can help with high-availability of read-only nodes.

The second main benefit is being able to use the replicas as read-only Redis servers, and use them to make any slow O(N) queries you might need, offloading some work from the master, whose job is receiving all the writes or receiving the faster queries.

### Limitations of replication

Replicas are read-only by default, so write commands issued against a replica will fail. There are configurations around this, check the documentation for more information.

Replication is asynchronous. This means that the master will acknowledge a write to the client before the write was successfully propagated to a replica. This creates the possibility of data loss, if the master fails after acknowledging the write but before propagating to the replica. Again, there are configurations around this to make it more safe (at the cost of worse performance).

Also, this setup does not provide any automatic failover. It is still your job to restart the master after a failure.

### When you should use replication

You should use this very simple setup when (all of the bellow):
- when you cannot afford to lose the data on your master
- when you don't need automatic failover (if you need it, use Redis Sentinel)

You can also use it when you can benefit from having read-only replicas to offload some work from the master.

## Partitioning

[The docs](https://redis.io/topics/partitioning) have a really good definition of partitioning:

> Partitioning is the process of splitting your data into multiple Redis instances, so that every instance will only contain a subset of your keys.

When using partitioning, some partitioning criteria is needed, to decide on which Redis server a given key should be located. The three main criterias are range partitioning, hash partitioning and consistent hashing.

Redis Cluster is the state-of-the-art way of working with partitioning in Redis, but for simpler cases you might need to handle the partitioning manually.

The actual partitioning (the mapping of a key to a Redis server) can happen in different parts of the stack:
- client side partitioning: the client computes the server from the key.
- proxy assisted partitioning: a proxy (like [Twemproxy](https://github.com/twitter/twemproxy)) sits in between client and servers and computes the correct server from the key.
- query routing: is the technique used by Redis Cluster, in which any Redis node can receive a query and will redirect the client to the correct node, given the partitioning scheme.

### Benefits of replication

Partitioning allows you to have larger datasets. If your dataset is 10Gb, but you only have nodes with 4Gb of memory, you can use 3 nodes and partition your data between the 3 nodes.

Also, partitioning allows you to split the work load between multiple nodes, scaling the computational power of your Redis setup to multiple CPUs and network adapters, instead of the single CPU and network adapter of a single-node setup.

### Limitations of partitioning

When you have keys distributed among multiple nodes, some operations involving multiple keys become useless. Like trying to compute the intersection between two sets will only work if the two keys are in the same node, which is something that the programmer should rely on. The same goes for transactions involving multiple keys.

Other limitation is regarding the partitioning granularity. Given the partition granularity is the key, a single key containing a huge list or set cannot be partitioned between multiple nodes.

At last, changing the system capacity (adding or removing nodes) is hard, because there is no automatic rebalancing mechanism. Redis Cluster solves this.

### When you should use partitioning

You should use this very simple partitioning when (one of the bellow):
- when your Redis dataset is too big to fit in the memory of a single node
- when you have a volume of requests that a single Redis node cannot keep up, and you want to distribute the load to multiple instances

## References

- https://redis.io/topics/replication
- https://redis.io/topics/partitioning
