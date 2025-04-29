#include "common.h"

int main( int argc, char* argv[] )
{
	std::cout << "[main]argc: " << argc << std::endl;;
	
	for(int i=0; i<argc; i++)
	{
		std::cout << "[main]argv" << i << ": " << argv[i] << std::endl;
	}

	return 0;
}
