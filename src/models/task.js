import { encode } from "../base62";
import { repr, isArray, isString, isInteger } from "../util";

export default class Task {
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
