import renderTaskList from "../tasks";
import { html } from "lit-html";

export default function renderProject({ id, label, tasks }) {
	return html`
<article id=${`project-${id}`} class="project">
	<h2>${label}</h2>
	${renderTaskList(tasks, id)}
</article>
	`;
}
