import Project from "../project/template";
import createElement, { Fragment } from "complate-dom";

export default ({ projects }) => <Fragment>
	<h1>Tash</h1>
	{projects.map(project => {
		return <Project project={project} />;
	})}
</Fragment>;
