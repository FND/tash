import { date2str } from "../../../util";
import classNames from "classnames";
import createElement from "complate-dom";

export default ({ tasks }) => {
	if(!tasks.length) {
		return <p>nothing to do here 🎉</p>;
	}

	return <ul class="tasks">
		{tasks.map(task => {
			return <Task task={task} />;
		})}
	</ul>;
}

function Task({ task }) {
	let { priority, contexts, threshold } = task;
	threshold = threshold && date2str(threshold);
	let cls = classNames({ completed: task.completed },
			priority && `priority-${priority.toLowerCase()}`);
	return <li class={cls} task={task}>
		{contexts &&
				<Contexts contexts={contexts} />}

		<p>{task.desc}</p>

		{threshold &&
				<time datetime={threshold}>{threshold}</time>}
	</li>;
}

function Contexts({ contexts }) {
	return <ul class="contexts">
		{contexts.map(context => {
			return <li>{context}</li>;
		})}
	</ul>;
}
