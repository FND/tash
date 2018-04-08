import { encode } from "../base62";
import { OrderedMap, repr, isArray, isString, isInteger } from "./util";

let VIRTUAL_PROJECT = "<unassociated>";

export class Store {
	constructor(latestID = 0) {
		this._projects = new OrderedMap();
		this._tasks = {};
		this._latest = latestID;
	}

	add(entity) {
		if(entity instanceof Task) {
			this._addTask(entity);
		} else if(entity instanceof Project) {
			this._addProject(entity);
		} else {
			throw new Error(`invalid store entity: ${repr(entity, true)}`);
		}
	}

	_addProject(project) {
		let { id } = project;
		if(this._projects.get(id)) {
			throw new Error(`duplicate project ID: ${repr(id)}`);
		}
		this._projects.set(id, project);
	}

	_addTask(task) {
		let { projects } = task;
		if(!projects.length) {
			projects = [VIRTUAL_PROJECT];
		}
		projects.forEach(id => {
			let project = this._projects.get(id);
			if(!project) {
				project = new Project(id);
				this._addProject(project);
			}
			project.add(task);
		});

		let { id } = task;
		if(!id) {
			task.id = id = this._generateID();
		}
		if(this._tasks[id]) {
			throw new Error(`duplicate task ID: ${repr(id)}`);
		}
		this._tasks[id] = task;
	}

	_generateID() {
		return ++this._latest;
	}
}

export class Project {
	constructor(id, label) {
		this.id = id;
		if(label) {
			this._label = label;
		}
		this.tasks = [];
	}

	add(task) {
		this.tasks.push(task);
	}

	get label() {
		return this._label || this.id;
	}
}

export class Task {
	static get slots() {
		return {
			id: isInteger,
			desc: isString,
			completed: value => value === true || value === false,
			priority: value => /^[A-Z]$/.test(value),
			projects: isArray,
			contexts: isArray,
			metadata: _ => true // ¯\_(ツ)_/¯
		};
	}

	constructor(fields) {
		Object.keys(this.constructor.slots).forEach(slot => {
			let value = this.validate(slot, fields[slot]);
			this[slot] = value;
		});
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

	get nid() { // node ID, inspired by Purple Numbers
		let { id } = this;
		if(!id) {
			throw new Error("missing task ID");
		}
		return encode(id);
	}

	set id(value) {
		this._id = this.validate("id", value);
	}

	get id() {
		return this._id;
	}
}
