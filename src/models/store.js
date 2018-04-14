import Project from "./project";
import Task from "./task";
import { BLANK, EOL } from "../parser/tokens";
import { OrderedMap } from "../util/ordered_map";
import { repr } from "../util";

let VIRTUAL_PROJECT = "<unassociated>";

export default class Store {
	constructor(latestID = 0) {
		this._projects = new OrderedMap();
		this._tasks = new OrderedMap();
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

	toString() {
		let preamble = this._projects.reduce((memo, project) => {
			if(!project.implicit) {
				memo.push(project.toString());
			}
			return memo;
		}, []);
		if(!preamble.length) {
			preamble = [BLANK];
		}
		return preamble.concat("").concat(this._tasks.all).join(EOL) + EOL;
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
		if(!projects || !projects.length) {
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
		if(this._tasks.get(id)) {
			throw new Error(`duplicate task ID: ${repr(id)}`);
		}
		this._tasks.set(id, task);
	}

	_generateID() {
		return ++this._latest;
	}
}
