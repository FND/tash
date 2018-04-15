import { html } from "lit-html";

export default function renderTaskList(tasks, namespace) {
	if(!tasks.length) {
		return html`<p>nothing to do here 🎉</p>`;
	}

	return html`
<ul class="tasks">
	${tasks.map(task => renderTask(task, namespace))}
</ul>
	`;
}

function renderTask(task, namespace) {
	let id = `task-${namespace}-${task.nid}`;
	let cls = task.completed ? "completed" : "";
	let prio = task.priority || "";

	let threshold = task.metadata.t;
	if(threshold) {
		threshold = threshold[0];
	}

	let { contexts } = task;
	return html`
<li id=${id} class=${cls} data-priority=${prio}>
	${contexts && renderContexts(contexts)}

	<p>${task.desc}</p>

	${threshold && html`
	<time datetime=${threshold}>${threshold}</time>
	`}
</li>
	`;
}

function renderContexts(contexts) {
	return html`
<ul class="contexts">
	${contexts.map(context => html`
	<li>${context}</li>
	`)}
</ul>
	`;
}
