export let prefixes = {
	"+": "project",
	"@": "context"
};
prefixes.reverse = Object.keys(prefixes).reduce((memo, prefix) => { // XXX: hacky
	let value = prefixes[prefix];
	memo[value] = prefix;
	return memo;
}, {});
export let completionMarker = "x";
export let priorityPattern = /^\([A-Z]\) */;
export let metadataSep = ":";
export let headerSep = ": ";
export let BLANK = "----"; // XXX: insufficiently unambiguous?
export let EOL = "\n";
