import argparse
from dotextensions.server.__main__ import start_server
from dothttp.__version__ import __version__ as version



def main():
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--version', action='store_true', help='prints version')
    parser.add_argument("--server_type", choices=["http", "version", "async", "cmd"], help="Type of server to run", default="cmd")
    parser.add_argument("--port", nargs="?", type=int, default=5000, help="Port number (only for http server)")
    args = parser.parse_args()
    if args.version:
        print(version)
    else:
        start_server(args.server_type, args.port)

if __name__ == "__main__":
    main()