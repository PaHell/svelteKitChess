export function objToCss(obj) {
	return Object.keys(obj)
		.map((key) => `${key}: ${obj[key]}px;`)
		.join('');
}
