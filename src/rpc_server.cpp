#include "../include/rpc_server.hpp"
#include <iostream>

RpcServer::RpcServer(asio::io_context& io_context, uint16_t port)
    : io_context_(io_context)
    , acceptor_(io_context, asio::ip::tcp::endpoint(asio::ip::tcp::v4(), port))
{}

void RpcServer::register_handler(const std::string& method, RpcHandler handler) {
    handlers_[method] = std::move(handler);
}

void RpcServer::start() {
    running_ = true;
    accept_connection();
}

void RpcServer::stop() {
    running_ = false;
    acceptor_.close();
}

void RpcServer::accept_connection() {
    acceptor_.async_accept(
        [this](std::error_code ec, asio::ip::tcp::socket socket) {
            if (!ec && running_) {
                // Handle connection in a separate thread
                std::thread([this, sock = std::move(socket)]() mutable {
                    handle_connection(std::move(sock));
                }).detach();
                
                accept_connection();
            }
        });
}

void RpcServer::handle_connection(asio::ip::tcp::socket socket) {
    try {
        asio::streambuf buffer;
        asio::read_until(socket, buffer, "\n");
        
        std::string request_str{
            std::istreambuf_iterator<char>(&buffer),
            std::istreambuf_iterator<char>()
        };
        
        auto response = handle_request(request_str);
        json response_json = {
            {"jsonrpc", response.jsonrpc},
            {"id", response.id}
        };
        
        if (response.result) {
            response_json["result"] = *response.result;
        }
        if (response.error) {
            response_json["error"] = *response.error;
        }
        
        std::string response_str = response_json.dump() + "\n";
        asio::write(socket, asio::buffer(response_str));
    }
    catch (const std::exception& e) {
        std::cerr << "Connection error: " << e.what() << std::endl;
    }
}

JsonRpcResponse RpcServer::handle_request(const std::string& request_str) {
    try {
        auto request_json = json::parse(request_str);
        JsonRpcRequest request{
            request_json["jsonrpc"],
            request_json["method"],
            request_json["params"],
            request_json["id"]
        };
        
        auto handler_it = handlers_.find(request.method);
        if (handler_it == handlers_.end()) {
            return JsonRpcResponse{
                "2.0",
                std::nullopt,
                json{{"code", -32601}, {"message", "Method not found"}},
                request.id
            };
        }
        
        auto result = handler_it->second(request.params);
        return JsonRpcResponse{
            "2.0",
            result,
            std::nullopt,
            request.id
        };
    }
    catch (const std::exception& e) {
        return JsonRpcResponse{
            "2.0",
            std::nullopt,
            json{{"code", -32603}, {"message", e.what()}},
            -1
        };
    }
} 