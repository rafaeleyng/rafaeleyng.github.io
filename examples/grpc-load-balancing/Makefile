image-proto:
	docker build -t grpc-demo -f ./docker/Dockerfile-proto .

proto-generate: image-proto
	docker run --rm -v $(PWD):/v grpc-demo protoc -I ./proto demo.proto --go_out=plugins=grpc:./generated

image-dns:
	docker build -t grpc-coredns -f ./docker/Dockerfile-coredns .

run-dns: image-dns
	docker rm -f grpc-coredns 2> /dev/null || true
	docker run -p 1053:53 -p 1053:53/udp -p 8080:8080 -p 9153:9153 --rm grpc-coredns

run-server:
	go run server/server.go

run-client:
	go run client/client.go
