cmake_minimum_required(VERSION 3.10)
project(p2p_jsonrpc)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(DEFINED ENV{VCPKG_ROOT})
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
endif()

set(CMAKE_TOOLCHAIN_FILE "$ENV{HOME}/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")

find_package(asio CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

include_directories(${ASIO_INCLUDE_DIRS})

add_executable(p2p_jsonrpc
    src/main.cpp
    src/rpc_server.cpp
)

target_include_directories(p2p_jsonrpc PRIVATE include)
target_link_libraries(p2p_jsonrpc PRIVATE
    asio::asio
    nlohmann_json::nlohmann_json
) 