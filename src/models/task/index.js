import Task from "./generic";
import { metadataSep } from "../../parser/tokens";
import { encode, decode } from "../../base62";
import { str2date, isInteger } from "../../util";

export default class TashTask extends Task {
	static get slots() {
		return Object.assign({}, super.slots, {
			id: isInteger
		});
	}

	constructor(fields) {
		super(fields);
		let { id } = this.metadata;
		if(id) {
			this.id = decode(id[0]);
		}
	}

	toString() {
		return super.toString() + " id" + metadataSep + this.nid;
	}

	get next() { // TODO: rename?
		return this.projects.includes("next");
	}

	set threshold(value) {
		this.metadata.t = [value.toISOString().substr(0, 10)];
	}

	get threshold() {
		let { t } = this.metadata;
		t = t && t[0];
		return t && str2date(t);
	}

	set id(value) {
		this._id = this.validate("id", value);
		this.nid = encode(this._id); // node ID, inspired by Purple Numbers
	}

	get id() {
		return this._id;
	}
}
