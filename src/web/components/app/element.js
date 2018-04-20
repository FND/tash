/* eslint-env browser */
import macro from "./template";
import parseTaskList from "../../../parser";
import { render } from "complate-dom";

let extensions = { t: v => Date(v) };

export default class App extends HTMLElement {
	connectedCallback() {
		let txt = this.querySelector("pre").textContent;
		let store = parseTaskList(txt, extensions);

		render(macro, store, this);
	}
}
