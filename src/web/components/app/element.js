/* eslint-env browser */
import parseTaskList from "../../../parser";
import { html, render } from "lit-html";

let extensions = { t: v => Date(v) };

export default class App extends HTMLElement {
	connectedCallback() {
		let txt = this.querySelector("pre").textContent;
		let store = parseTaskList(txt, extensions);
		render(renderApp(store), this);

		// XXX: DEBUG
		let nodes = document.querySelectorAll("li");
		[...nodes].forEach(node => {
			console.log("[CHECK]", JSON.stringify(node.className), node);
		});
	}
}

function renderApp({ projects }) {
	let groups = projects.map(renderProject);
	return html`
<h1>Tash</h1>
${groups}
	`;
}

function renderProject({ id, label, tasks }) {
	return html`
<article id=${`project-${id}`}>
	<h3>${label}</h3>
	${renderTaskList(tasks, id)}
</article>
	`;
}

function renderTaskList(tasks, namespace) {
	if(!tasks.length) {
		return html`<p>nothing to do here 🎉</p>`;
	}

	return html`
<ul>
	${tasks.map(task => renderTask(task, namespace))}
</ul>
	`;
}

function renderTask(task, namespace) {
	let id = `task-${namespace}-${task.nid}`;
	let cls = task.completed ? "completed" : null; // FIXME: results in `"undefined"`
	return html`
<li id=${id} class=${cls}>
	${task.desc}
</li>
	`;
}
