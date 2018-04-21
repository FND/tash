export function date2str(value) {
	return value.toISOString().substr(0, 10);
}

// NB: native date parsing is considered unreliable
export function str2date(value) {
	let raise = _ => {
		throw new Error(`invalid date: ${repr(value)}`);
	};

	let [y, m, d, remainder] = value.split("-").map((part, i) => {
		part = parseInt(part, 10);
		if(!isInteger(part)) {
			raise();
		}
		return i === 2 ? part + 1 : part; // NB: special-casing for days
	});
	if(remainder !== undefined) {
		raise();
	}

	return new Date(y, m, d);
}

export function repr(value, jsonify) {
	if(jsonify) {
		value = JSON.stringify(value);
	}
	return `\`${value}\``;
}

export function isArray(value) {
	return value && !!value.pop;
}

export function isString(value) {
	return value && !!value.substr;
}

export function isInteger(value) {
	return Number.isInteger(value);
}
