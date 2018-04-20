"use strict";

module.exports = {
	sass: [{
		source: "./src/web/index.scss",
		target: "./dist/bundle.css"
	}],
	js: [{
		source: "./src/web/index.js",
		target: "./dist/bundle.js",
		jsx: { pragma: "createElement" }
	}]
};
