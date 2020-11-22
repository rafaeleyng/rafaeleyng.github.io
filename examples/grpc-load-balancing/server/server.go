package main

import (
	"context"
	"errors"
	"fmt"
	"net"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"

	protos "grpc-load-balancing/generated"
)

type demoService struct {
	address string
}

var count = 0

func (d demoService) GetAddress(ctx context.Context, request *protos.GetAddressRequest) (*protos.GetAddressResponse, error) {
	count += 1
	fmt.Println("requests:", count)
	return &protos.GetAddressResponse{Address: d.address}, nil
}

func main() {
	address := os.Getenv("ADDRESS")
	if address == "" {
		panic(errors.New("ADDRESS environment variable is required"))
	}

	opts := []grpc.ServerOption{
		grpc.KeepaliveParams(keepalive.ServerParameters{
			MaxConnectionAge: 10 * time.Second,
		}),
	}

	service := &demoService{address: address}

	grpcServer := grpc.NewServer(opts...)
	protos.RegisterDemoServer(grpcServer, service)

	listener, err := net.Listen("tcp", address)
	if err != nil {
		panic(err)
	}
	fmt.Printf("⇨ grpc server started on %s\n", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		panic(err)
	}
}
