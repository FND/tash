/* eslint-env browser */
import macro from "./template";
import { render } from "complate-dom";

export default class TaskList extends HTMLElement {
	connectedCallback() {
		render(macro, this, this);
	}
}
