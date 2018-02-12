iterator.js: iterator.es6.js
	sed "s/^export default /module\.exports = /" iterator.es6.js > iterator.js

Documentation.md: iterator.es6.js
	./node_modules/.bin/jsdoc2md iterator.es6.js > Documentation.md
