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
