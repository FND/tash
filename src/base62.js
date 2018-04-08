// based loosely on Base62.js <https://github.com/andrew/base62.js> (MIT)

let CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

// NB: does not validate input
export function encode(int) {
	if(int === 0) {
		return CHARSET[0];
	}

	let res = "";
	while(int > 0) {
		res = CHARSET[int % 62] + res;
		int = Math.floor(int / 62);
	}
	return res;
}

export function decode(str) {
	let res = 0;
	let { length } = str;
	let i, char;
	for(i = 0; i < length; i++) {
		char = str.charCodeAt(i);
		if(char < 58) { // 0-9
			char = char - 48;
		} else if(char < 91) { // A-Z
			char = char - 55;
		} else { // a-z
			char = char - 61;
		}
		res += char * (62 ** (length - i - 1));
	}
	return res;
}
