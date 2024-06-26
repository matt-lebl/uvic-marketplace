PUML_PATHS  := $(shell find . -type f -name "*.puml")
PNG_PATHS   := $(patsubst %.puml,%.png,$(PUML_PATHS))
SVG_PATHS   := $(patsubst %.puml,%.svg,$(PUML_PATHS))

png: $(PNG_PATHS)

svg: $(SVG_PATHS)

print:
	echo $(PNG_PATHS)

%.png: %.puml
	plantuml -tpng $<

%.svg: %.puml
	plantuml -tsvg $<

clean:
	rm -f $(PNG_PATHS)
	rm -f $(SVG_PATHS)

.PHONY: png svg clean

all: | close-all build-all run-all

close-all: ## Closes all containers
	@echo "=================================================="
	@echo "Make: close - closing containers"
	@echo "=================================================="
	@docker-compose -f compose.yaml down

install-all: ## Installs dependencies for all containers
	@echo "=================================================="
	@echo "Make: install-all - installing dependencies"
	@echo "=================================================="
	@cd ./frontend && npm install && cd ..

build-all: ## Builds all containers
	@echo "=================================================="
	@echo "Make: build-all - building containers"
	@echo "=================================================="
	@docker-compose -f compose.yaml build

run-all: ## Runs all containers
	@echo "=================================================="
	@echo "Make: run-all - running containers"
	@echo "=================================================="
	@docker-compose -f compose.yaml up -d

cleanall: ## Closes and cleans (removes) all containers
	@echo "=================================================="
	@echo "Make: cleanall - closing and cleaning containers"
	@echo "=================================================="
	@docker-compose -f compose.yaml down -v --rmi all --remove-orphans