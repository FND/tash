import { prefixes, metadataSep } from "../../parser/tokens";
import { repr, isArray, isString } from "../../util";

export default class Task {
	static get slots() {
		return {
			desc: isString,
			completed: value => value === true || value === false,
			priority: value => /^[A-Z]$/.test(value),
			projects: isArray,
			contexts: isArray,
			metadata: _ => true // ¯\_(ツ)_/¯
		};
	}

	constructor(fields) {
		if(!fields) {
			throw new Error("missing task fields");
		}
		Object.keys(this.constructor.slots).forEach(slot => {
			let value = this.validate(slot, fields[slot]);
			this[slot] = value;
		});
	}

	addProject(project) {
		let { projects } = this;
		if(!projects.includes(project)) {
			projects.push(project);
		}
	}

	validate(slot, value) {
		let { slots } = this.constructor;
		if(value === null || value === undefined) { // all slots are nullable
			value = null;
		} else if(!slots[slot](value)) {
			throw new Error("invalid value for task slot " +
					`${repr(slot)}: ${repr(value, true)}`);
		}
		return value;
	}

	toString() {
		let line = [];
		let prfx = prefixes.reverse;

		if(this.completed) {
			line.push("x");
		}
		if(this.priority) {
			line.push(`(${this.priority})`);
		}
		line.push(this.desc);
		this.projects.forEach(p => {
			line.push(prfx.project + p);
		});
		this.contexts.forEach(c => {
			line.push(prfx.context + c);
		});
		let meta = this.metadata;
		Object.keys(meta).forEach(key => {
			let values = meta[key];
			values.forEach(value => {
				line.push(key + metadataSep + value);
			});
		});
		return line.join(" ");
	}
}
