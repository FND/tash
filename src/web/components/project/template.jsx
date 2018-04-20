import createElement from "complate-dom";

export default ({ project }) => {
	let { label, tasks } = project;
	return <article class="project">
		<h2>{label}</h2>
		<tash-tasks tasks={tasks} />
	</article>;
}
