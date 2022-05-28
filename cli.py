import argparse
from dotextensions.server.__main__ import main as server
from dothttp.__version__ import __version__ as version


parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--version', action='store_true', help='prints version')

args = parser.parse_args()

if args.version:
    print(version)
else:
    server()
