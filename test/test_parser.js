/* global describe, it */
import * as fixtures from "./fixtures";
import { extensions } from "../src/parser/tash";
import parseTaskList, { parseTask } from "../src/parser";
import assert from "assert";

let assertSame = assert.strictEqual;
let assertDeep = assert.deepStrictEqual;

describe("parser", _ => {
	it("should deserialize individual tasks", () => {
		let task = parseTask(fixtures.task, extensions);
		assertSame(task.id, null);
		assertSame(task.completed, true);
		assertSame(task.priority, "A");
		assertDeep(task.projects, ["next", "alpha", "bravo"]);
		assertDeep(task.contexts, ["foo", "bar"]);
		assertDeep(Object.keys(task.metadata), ["t"]);
		assertDeep(task.metadata.t, ["2018-03-18"]);
		assertSame(task.desc, "lorem ipsum dolor sit amet");

		task = parseTask(`${fixtures.task} id:C3j`, extensions);
		assertSame(task.id, 46359);
		assertDeep(task.metadata.id, ["C3j"]);
		assertDeep(task.metadata.t, ["2018-03-18"]);
	});

	it("should index tasks by project", () => {
		let store = parseTaskList(fixtures.taskList, extensions);
		let projects = store._projects;
		assertSame(store._latest, 54286 + 3 - 1); // one task with, two without ID
		assertDeep(projects.map(p => p.id),
				["next", "alpha", "bravo", "charlie", "delta", "<unassociated>"]);
		assertDeep(projects.map(p => p.label),
				["Today", "alpha", "Lipsum", "charlie", "delta", "<unassociated>"]);
		assertDeep(projects.get("next").tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertDeep(projects.get("alpha").tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertDeep(projects.get("bravo").tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertSame(projects.get("charlie").tasks.length, 0);
		assertDeep(projects.get("delta").tasks.map(t => t.desc), ["lorem ipsum"]);
		assertDeep(projects.get("<unassociated>").tasks.map(t => t.desc),
				["dolor sit amet"]);
		assertDeep(projects.get("next").tasks.map(t => t.nid), ["E7b"]);
		assertDeep(projects.get("delta").tasks.map(t => t.nid), ["E7Z"]);
		assertDeep(projects.get("<unassociated>").tasks.map(t => t.nid), ["E7c"]);
	});

	it("should support blank preamble", () => {
		let store = parseTaskList(`1\n----\n\n${fixtures.task}\n`, extensions);
		let projects = store._projects;
		assertDeep(projects.map(p => p.id),
				["next", "alpha", "bravo"]);
		assertDeep(projects.map(p => p.label),
				["next", "alpha", "bravo"]);
	});
});
