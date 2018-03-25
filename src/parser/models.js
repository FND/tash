import { OrderedMap, repr, isArray } from "./util";
import md5 from "blueimp-md5"; // TODO: use minified version for browsers

let VIRTUAL_PROJECT = "<unassociated>";

export class Store {
	constructor() {
		this._projects = new OrderedMap();
		this._tasks = {};
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
		if(this._tasks[id]) {
			throw new Error(`duplicate task ID: ${repr(id)}`);
		}
		this._tasks[id] = task;
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
			desc: value => value && value.substr,
			completed: value => value === true || value === false,
			priority: value => /^[A-Z]$/.test(value),
			projects: isArray,
			contexts: isArray,
			metadata: _ => true // ¯\_(ツ)_/¯
		};
	}

	constructor(original, fields) {
		this.id = md5(original);
		let { slots } = this.constructor;
		Object.keys(slots).forEach(field => {
			let value = fields[field];
			if(value === null || value === undefined) { // all fields are nullable
				value = null;
			} else if(!slots[field](value)) { // validate
				throw new Error("invalid value for task field " +
						`${repr(field)}: ${repr(value, true)}`);
			}
			this[field] = value;
		});
	}
}
