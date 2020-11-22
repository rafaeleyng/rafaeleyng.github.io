---
title: "gRPC load balancing with grpc-go"
date: 2020-11-22
excerpt: >
  gRPC load balancing with grpc-go
---

gRPC poses a [known problem](https://kubernetes.io/blog/2018/11/07/grpc-load-balancing-on-kubernetes-without-tears/) for load balancing if you have an L4 load balancer in front of multiple instances of your backend gRPC server.

In short, L4 load balancers balanced at the _connection level_, which for HTTP 1.1 normally is just fine. But gRPC uses HTTP 2, where a single, long-lived connection is kept and all requests are multiplexed within it. So we would need a balancer working at the _request level_.

My team recently faced that issue, and we used an L4 balancer, in the form of a Kubernetes external service (`type: LoadBalancer`). Since changing that was not an option at the moment, we took the approach of client-side balancing, which itself was hard to set up because the documentation was somewhat lacking. We also considered using a [look-aside](https://grpc.io/blog/grpc-load-balancing/#lookaside-load-balancing) load balancer, but the client-side ended up being easier to implement and maintain.

## Constraints

We needed a solution that would work well with several constraints since our system runs in a dynamic environment, where the gRPC server instances are not expected to be statically known:
1. the client must to discover all the instances of the gRPC server and open a single, long-lived connection directly with each one (not going through the load balancer)
3. if instances of the gRPC server are removed, the client must acknowledge that and remove those connections
2. similarly, if new instances of the gRPC server are added, the client must create new connections with those new instances

## DNS name resolution

The gRPC documentation mentions support for [DNS as the default name system](https://github.com/grpc/grpc/blob/master/doc/naming.md). It wasn't obvious to me at first how to benefit from this, but our co-workers who work on [Tsuru](https://github.com/tsuru/tsuru) (our PaaS that works on top of Kubernetes) suggested using a [Headless Service](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services) as a way of obtaining the addresses of the Pods behind our actual Service.

We used the lib go-grpc, which we've found to have support for [DNS resolver](https://github.com/grpc/grpc-go/blob/master/internal/resolver/dns/dns_resolver.go) and also for balancing requests across several instances with various strategies (we went for [round-robin](https://github.com/grpc/grpc-go/blob/master/balancer/roundrobin/roundrobin.go)).

Configuring this was not clearly documented in lib as would I expect. The two main changes we've done in our client were:
- add the `WithDefaultServiceConfig` DialOption with the load balancing policy
- specify a DNS URI pointing to the Headless Server we've mentioned

The result was like:
```go
import (
  "google.golang.org/grpc"
)

conn, err := grpc.Dial("dns:///my-headless-service:5000",
  grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`),
)
```

Since I could not access the Headless Service from my local machine in development (it is an intra-cluster address), I had to set up a local DNS server to experiment with this, while on production I would not specify a DNS and let the Pod use its default.

Never having worked with it before, the DNS URI tricked me into some errors. First, [the documentation](https://github.com/grpc/grpc/blob/master/doc/naming.md) states that the scheme is `dns:[//authority/]host[:port]`, which makes all slashes lookup optional when you do not specify an authority (the DNS server you want to use, if not the default configured on the OS), which was my case in production.

So while I was able to make this work locally by using `dns://localhost:1053/my-headless-service:5000`, in production I first tried a naked `dns:my-headless-service:5000` and a double-slashed `dns://my-headless-service:5000` before landing on the correct triple-slashed `dns:///my-headless-service:5000`.

Also, note that the port `5000` is not important in this resolution process. It is just the port where each pod is exposing my gRPC server.

## Connection Timeout on gRPC server

Remember my 3 constraints? The client configuration only solves number 1.

If I remove instances of my service, it would cause connections to fail and [the client to re-resolve the names](https://github.com/grpc/grpc-go/issues/3170#issuecomment-552517779). This is default behavior of the lib and solves constraint number 2.

If everything is stable, the client never re-resolves the names and recreates new connections. So, if I double the number of instances of my service, the new ones would never receive connections and would be idle. And this fails constraint 3.

To work around this, we've configured a [MAX_CONNECTION_AGE](https://github.com/grpc/proposal/blob/master/A9-server-side-conn-mgt.md):
```go
import (
  "google.golang.org/grpc"
  "google.golang.org/grpc/keepalive"
)

opts := []grpc.ServerOption{
  grpc.KeepaliveParams(keepalive.ServerParameters{
  MaxConnectionAge: time.Minute * 5,
  }),
}
```

When the connection reaches its max-age, it will be closed and will trigger a re-resolve from the client. If new instances were added in the meantime, the client will see them now and open connections to them as well.

## Demo

I've set up [a demo](https://github.com/rafaeleyng/rafaeleyng.github.io/blob/dev/examples/grpc-load-balancing/README.md) with a local DNS server to show this working.
