export function objToCss(obj) {
	return Object.keys(obj)
		.map((key) => `${key}: ${obj[key]}px;`)
		.join('');
}

export function debounce(func, delay) {
	let timer;
	return function () {
		//anonymous function
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}

export function throttle(func, limit) {
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}
