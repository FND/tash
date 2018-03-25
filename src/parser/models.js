import md5 from "blueimp-md5"; // TODO: use minified version for browsers

let VIRTUAL_PROJECT = "<unassociated>";

export class Store {
	constructor() {
		this._projects = {};
		this._projectOrder = []; // XXX: awkward; encapsulate within `_projects` (ordered map)
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
		if(this._projects[id]) {
			throw new Error(`duplicate project ID: ${repr(id)}`);
		}
		this._projects[id] = project;
		this._projectOrder.push(id);
	}

	_addTask(task) {
		let { projects } = task;
		if(!projects.length) {
			projects = [VIRTUAL_PROJECT];
		}
		projects.forEach(id => {
			let project = this._projects[id];
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

function repr(value, jsonify) {
	if(jsonify) {
		value = JSON.stringify(value);
	}
	return `\`${value}\``;
}

function isArray(value) {
	return value && !!value.pop;
}
