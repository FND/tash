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
