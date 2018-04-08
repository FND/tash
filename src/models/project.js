export default class Project {
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
