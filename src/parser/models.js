export class Project {
	constructor(id, label) {
		this.id = id;
		if(label) {
			this.label = label;
		}
		this.tasks = [];
	}

	add(task) {
		this.tasks.push(task);
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

	constructor(desc, fields) {
		fields = Object.assign({}, fields, { desc });
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
