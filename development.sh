#!/bin/sh

docker run --name development -it -v ${PWD}:/workdir:Z -v ${PWD}/../simple.db:/sqlite/simple.db:Z -p 8080:5000 rymeria-development /bin/sh
