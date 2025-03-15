#include "../include/rpc_server.hpp"
#include <iostream>

int main() {
    std::cout << "Starting server..." << std::endl;
    
    try {
        asio::io_context io_context;
        
        // Create RPC server
        RpcServer server(io_context, 8080);
        
        // Register some example handlers
        server.register_handler("echo", [](const json& params) {
            return params[0];
        });
        
        server.register_handler("add", [](const json& params) {
            int sum = 0;
            for (const auto& num : params) {
                sum += num.get<int>();
            }
            return json(sum);
        });
        
        // Start the server
        server.start();
        
        // Run the IO context
        io_context.run();
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
} 