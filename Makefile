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

frontend: | close-frontend build-frontend run-frontend

close-frontend: ## Closes the frontend container
	@echo "=================================================="
	@echo "Make: close-frontend - closing FE container"
	@echo "=================================================="
	@docker-compose -f docker-compose.yml down

build-frontend: ## Builds the frontend container
	@echo "=================================================="
	@echo "Make: build-frontend - building FE container"
	@echo "=================================================="
	@docker-compose -f docker-compose.yml build

run-frontend: ## Runs the frontend container
	@echo "=================================================="
	@echo "Make: run-frontend - running FE container"
	@echo "=================================================="
	@docker-compose -f docker-compose.yml up -d

cleanall: ## Closes and cleans (removes) all containers
	@echo "=================================================="
	@echo "Make: cleanfe - closing and cleaning Docker containers"
	@echo "=================================================="
	@docker-compose -f docker-compose.yml down -v --rmi all --remove-orphans