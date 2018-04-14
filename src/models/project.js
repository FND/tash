import { prefixes, headerSep } from "../parser/tokens";

export default class Project {
	constructor(id, label) {
		this.id = id;
		if(label) {
			this._label = label;
		}
		this.tasks = [];
		// indicates that project was created explicitly as part of the preamble
		// XXX: awkward/brittle, breaks encapsulation
		this.implicit = label === undefined;
	}

	add(task) {
		this.tasks.push(task);
	}

	toString() {
		let line = prefixes.reverse.project + this.id;
		let label = this._label;
		return label ? line + headerSep + label : line;
	}

	get label() {
		return this._label || this.id;
	}
}
