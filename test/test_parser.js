/* global describe, it */
import { parseTask } from "../src/parser";
import assert from "assert";

let assertSame = assert.strictEqual;
let assertDeep = assert.deepStrictEqual;

let extensions = {
	t: v => Date(v)
};
let fixtureTask = "x (A) lorem ipsum +next dolor sit amet +alpha +bravo @foo @bar t:2018-03-18";

describe("parser", _ => {
	it("should deserialize individual tasks", () => {
		let task = parseTask(fixtureTask, extensions);
		assertSame(task.completed, true);
		assertSame(task.priority, "A");
		assertDeep(task.projects, ["next", "alpha", "bravo"]);
		assertDeep(task.contexts, ["foo", "bar"]);
		assertDeep(Object.keys(task.metadata), ["t"]);
		assertDeep(task.metadata.t, ["2018-03-18"]);
		assertSame(task.desc, "lorem ipsum dolor sit amet");
	});
});
