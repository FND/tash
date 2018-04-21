/* eslint-env browser */
import macro from "./template";
import { extensions } from "../../../parser/tash";
import parseTaskList from "../../../parser";
import { render } from "complate-dom";

export default class App extends HTMLElement {
	connectedCallback() {
		let txt = this.querySelector("pre").textContent;
		let store = parseTaskList(txt, extensions);

		render(macro, store, this);
	}
}
