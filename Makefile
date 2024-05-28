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
