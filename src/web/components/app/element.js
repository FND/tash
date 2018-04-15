/* eslint-env browser */
import renderProject from "../project";
import parseTaskList from "../../../parser";
import { html, render } from "lit-html";

let extensions = { t: v => Date(v) };

export default class App extends HTMLElement {
	connectedCallback() {
		let txt = this.querySelector("pre").textContent;
		let store = parseTaskList(txt, extensions);
		render(renderApp(store), this);
	}
}

function renderApp({ projects }) {
	let groups = projects.map(renderProject);
	return html`
<h1>Tash</h1>
${groups}
	`;
}
