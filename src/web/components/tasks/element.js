/* eslint-env browser */
import macro from "./template";
import { render } from "complate-dom";

export default class TaskList extends HTMLElement {
	connectedCallback() {
		render(macro, this, this);

		this.addEventListener("click", this.onClick);
	}

	onClick(ev) {
		let btn = ev.target;
		// event delegation -- XXX: crude
		if(btn.nodeName !== "BUTTON" || !btn.closest(".controls")) {
			return;
		}
		let el = btn.closest(".task");
		let app = el.closest("tash-app");

		el.task.addProject("next");
		app.render(true);
	}
}
