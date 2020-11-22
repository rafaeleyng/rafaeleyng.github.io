package main

import (
	"context"
	"fmt"
	"time"

	"google.golang.org/grpc"

	protos "grpc-load-balancing/generated"
)

func main() {
	conn, err := grpc.Dial("dns://localhost:1053/my-headless-service.demo.local:5000",
		grpc.WithInsecure(),
		grpc.WithBlock(),
		grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`),
		grpc.WithTimeout(10*time.Second),
	)
	if err != nil {
		panic(err)
	}

	client := protos.NewDemoClient(conn)

	for {
		res, err := client.GetAddress(context.Background(), &protos.GetAddressRequest{})
		if err != nil {
			panic(err)
		}
		fmt.Println("server address:", res.Address)
		time.Sleep(time.Second)
	}
}
