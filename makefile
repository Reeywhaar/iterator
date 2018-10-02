.PHONY: build
build: buildCommonJS buildES6

.PHONY: buildCommonJS
buildCommonJS:
	./node_modules/.bin/tsc

.PHONY: buildES6
buildES6:
	./node_modules/.bin/tsc --build tsconfig.es.json

.PHONY: docs
docs:
	node_modules/.bin/typedoc --excludeExternals --theme minimal --out ./docs/
	touch docs

.PHONY: test
test:
	node_modules/.bin/jest --verbose

# Docker #

.PHONY: dockerBuildImage
dockerBuildImage:
	docker-compose -f docker-compose.yml build

.PHONY: dockerShell
dockerShell:
	docker-compose -f docker-compose.yml run --rm builder

.PHONY: dockerDocs
dockerDocs:
	docker-compose -f docker-compose.yml run --rm builder -c "make docs"

.PHONY: dockerBuild
dockerBuild:
	docker-compose -f docker-compose.yml run --rm builder -c "make build"

.PHONY: dockerBuildCommonJS
dockerBuildCommonJS:
	docker-compose -f docker-compose.yml run --rm builder -c "make buildCommonJS"

.PHONY: dockerBuildES6
dockerBuildES6:
	docker-compose -f docker-compose.yml run --rm builder -c "make buildES6"

.PHONY: dockerTest
dockerTest:
	docker-compose -f docker-compose.yml run --rm builder -c "make test"
