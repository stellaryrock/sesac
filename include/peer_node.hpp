#pragma once
#include <string>
#include <optional>
#include <variant>
#include <functional>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

struct PeerNode {
    const std::string node_id;
    const std::string address;
    const uint16_t port;
};

struct JsonRpcRequest {
    const std::string jsonrpc{"2.0"};
    const std::string method;
    const json params;
    const json id;
};

struct JsonRpcResponse {
    const std::string jsonrpc{"2.0"};
    const std::optional<json> result;
    const std::optional<json> error;
    const json id;
};

// Type alias for RPC method handlers
using RpcHandler = std::function<json(const json&)>; 