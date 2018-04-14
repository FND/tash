/* global describe, it */
import Store from "../src/models/store";
import Project from "../src/models/project";
import Task from "../src/models/task";
import assert from "assert";

let assertSame = assert.strictEqual;

let task = {
	desc: "lorem ipsum dolor sit amet",
	completed: true,
	priority: "A",
	projects: ["next", "alpha", "bravo"],
	contexts: ["foo", "bar"],
	metadata: { t: ["2018-03-18"] }
};
let txt = "x (A) lorem ipsum dolor sit amet +next +alpha +bravo @foo @bar t:2018-03-18";

describe("store", _ => {
	it("should support serialization", () => {
		let store = new Store();
		store.add(new Project("next", null));
		store.add(new Project("<unassociated>", "misc."));
		store.add(new Task(task));

		let expected = `
+next
+<unassociated>: misc.

${txt}
		`.trim();
		assertSame(store.toString(), expected + "\n");
	});

	it("should support blank preamble during serialization", () => {
		let store = new Store();
		store.add(new Task(task));

		assertSame(store.toString(), `----\n\n${txt}\n`);
	});
});
