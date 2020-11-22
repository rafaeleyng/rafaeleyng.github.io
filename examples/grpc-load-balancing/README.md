# grpc-load-balancing demo

This is a demo for https://rafaeleyng.github.io/grpc-load-balancing-with-grpc-go.

## requirements

Requires Docker and Go (tested with 1.14, should work with earlier versions).

We well need to use more than one loopback address. On a Linux, this should just work. On a Mac, run:

```shell
sudo ifconfig lo0 alias 127.0.0.2 up
sudo ifconfig lo0 alias 127.0.0.3 up
```

## execution

1. run the DNS in one terminal: `make run-dns`. At this point, the DNS is only resolving to the first 2 gRPC servers.
2. run the on 3 other terminals:
    - `ADDRESS=127.0.0.1:5000 make run-server`
    - `ADDRESS=127.0.0.2:5000 make run-server`
    - `ADDRESS=127.0.0.3:5000 make run-server`
3. run the client: `make run-client`. Notice how it only calls the first 2 servers, because they are the only ones resolved by the DNS.
4. after some seconds, stop the DNS, run `echo "my-headless-service.demo.local.	IN A	127.0.0.3" >> docker/db.zone` and run `make run-dns` again.
5. the gRPC servers are configured to kill the connections every 10 seconds, so in the next window, the client would re-resolve, and start calling also the third server. 

## cleanup

Only required for Mac.

```shell
sudo ifconfig lo0 -alias 127.0.0.2 up
sudo ifconfig lo0 -alias 127.0.0.3 up
```
