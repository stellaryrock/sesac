#pragma once
#include <iostream>
#include <asio.hpp>
#include <unordered_map>
#include "peer_node.hpp"

class RpcServer {
public:
    RpcServer(asio::io_context& io_context, uint16_t port);
    
    void register_handler(const std::string& method, RpcHandler handler);
    void start();
    void stop();

private:
    void accept_connection();
    void handle_connection(asio::ip::tcp::socket socket);
    JsonRpcResponse handle_request(const std::string& request_str);

    asio::io_context& io_context_;
    asio::ip::tcp::acceptor acceptor_;
    std::unordered_map<std::string, RpcHandler> handlers_;
    bool running_{false};
}; 