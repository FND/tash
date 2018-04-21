/* eslint-env browser */
import macro from "./template";
import { extensions } from "../../../parser/tash";
import parseTaskList from "../../../parser";
import { render } from "complate-dom";

export default class App extends HTMLElement {
	connectedCallback() {
		let txt = this.querySelector("pre").textContent;
		this.store = parseTaskList(txt, extensions);

		this.render();
	}

	render(force) {
		if(force) { // XXX: crude
			this.store = parseTaskList(this.store.toString(), extensions);
		}
		render(macro, this.store, this);
	}
}
