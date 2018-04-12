let fs = require("fs");
let path = require("path");

export let task = read("single.txt");
export let taskList = read("multi.txt");

function read(filename) {
	let filepath = path.resolve(__dirname, filename);
	return fs.readFileSync(filepath, "utf-8");
}
