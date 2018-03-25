// based on todo.txt format <https://github.com/todotxt/todo.txt>, with the
// addition of a project preamble (for ordering and custom labeling)

import { Project } from "./models";

let EOL = "\n";

let PREFIXES = {
	"+": "project",
	"@": "context"
};

export default function parseTaskList(txt, extensions) {
	txt = normalize(txt).trim();
	let [projects, ...tasks] = txt.split("\n\n");
	tasks = tasks.join("\n");

	let prefix = "+";
	projects = projects.split("\n").reduce((memo, project) => {
		if(project.indexOf(prefix) !== 0) {
			throw new Error("invalid entry in preamble");
		}
		let id = project.substr(prefix.length); // discard prefix

		let i = id.indexOf(": ");
		if(i === -1) {
			memo[id] = new Project(id);
		} else {
			let label = id.substr(i + 2);
			id = id.substr(0, i);
			memo[id] = new Project(id, label);
		}
		return memo;
	}, {});

	tasks.split("\n").forEach(line => {
		let task = parseTask(line, extensions);
		if(!task) {
			return;
		}

		task.projects.forEach(id => {
			let project = projects[id];
			if(!project) {
				project = new Project(id);
				projects[id] = project;
			}
			project.add(task);
		});
	}, []);

	return projects;
}

// `extensions` is a mapping of supported metadata keys to corresponding
// value-transformation functions (e.g. `{ due: value => new Date(value) }`)
export function parseTask(line, extensions) {
	line = normalize(line).trim();
	if(!line) {
		return null; // XXX: awkward?
	}
	if(line.indexOf(EOL) !== -1) {
		throw new Error("invalid multi-line task");
	}

	let task = line.split(" ").reduce((memo, el, i) => {
		let first = i === 0;
		if(first && el === "x") {
			memo.completed = true; // TODO: support for completion date
			return memo;
		}

		if((first || (i === 1 && memo.completed)) && /^\([A-Z]\) */.test(el)) {
			memo.priority = el.substr(1, 1);
			return memo;
		}

		let prefix = PREFIXES[el.substr(0, 1)];
		if(prefix) {
			let id = el.substr(1);
			switch(prefix) {
			case "project":
				memo.projects.push(id);
				break;
			case "context":
				memo.contexts.push(id);
				break;
			}
			return memo;
		}

		let index = extensions ? el.indexOf(":") : -1; // XXX: hacky
		if(index !== -1) {
			let key = el.substring(0, index);
			let fn = extensions[key];
			if(fn) {
				let value = el.substr(index + 1);

				let meta = memo.metadata;
				if(!meta[key]) {
					meta[key] = [];
				}
				meta[key].push(value);

				return memo;
			}
		}

		memo.desc.push(el);
		return memo;
	}, {
		completed: false,
		priority: null,
		projects: [],
		contexts: [],
		metadata: {},
		desc: []
	});
	task.desc = task.desc.join(" ");
	return task;
}

function normalize(txt) {
	return txt.replace(/\r\n|\r/g, EOL);
}
