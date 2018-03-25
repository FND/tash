/* global describe, it */
import parseTaskList, { parseTask } from "../src/parser";
import assert from "assert";

let assertSame = assert.strictEqual;
let assertDeep = assert.deepStrictEqual;

let extensions = {
	t: v => Date(v)
};
let fixtureTask = "x (A) lorem ipsum +next dolor sit amet +alpha +bravo @foo @bar t:2018-03-18";
let fixtureTaskList = `
+next: Today
+alpha
+bravo: Lipsum
+charlie

${fixtureTask}
lorem ipsum +delta

dolor sit amet
`;

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

	it("should index tasks by project", () => {
		let store = parseTaskList(fixtureTaskList, extensions);
		let projects = store._projects;
		assertDeep(store._projectOrder,
				["next", "alpha", "bravo", "charlie", "delta", "<unassociated>"]);
		assertDeep(Object.keys(projects),
				["next", "alpha", "bravo", "charlie", "delta", "<unassociated>"]);
		assertDeep(Object.values(projects).map(p => p.label),
				["Today", "alpha", "Lipsum", "charlie", "delta", "<unassociated>"]);
		assertDeep(projects.next.tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertDeep(projects.alpha.tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertDeep(projects.bravo.tasks.map(t => t.desc),
				["lorem ipsum dolor sit amet"]);
		assertSame(projects.charlie.tasks.length, 0);
		assertDeep(projects.delta.tasks.map(t => t.desc), ["lorem ipsum"]);
		assertDeep(projects["<unassociated>"].tasks.map(t => t.desc),
				["dolor sit amet"]);
	});
});
