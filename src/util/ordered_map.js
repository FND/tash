import { repr } from "./index";

export class OrderedMap {
	constructor() {
		this._items = {};
		this._order = [];
	}

	reduce(fn, initial) {
		let items = this._items;
		return this._order.reduce((memo, id, i) => fn(memo, items[id], i), initial);
	}

	map(fn) {
		let items = this._items;
		return this._order.map((id, i) => fn(items[id], i));
	}

	forEach(fn) {
		let items = this._items;
		this._order.forEach((id, i) => {
			fn(items[id], i);
		});
	}

	set(id, item) {
		let items = this._items;
		if(items[id]) {
			// for simplicity WRT ordering, we consider this part immutable
			throw new Error(`duplicate project ID: ${repr(id)}`);
		}
		items[id] = item;
		this._order.push(id);
	}

	get(id) {
		return this._items[id];
	}

	get all() {
		return this.map(item => item);
	}
}
