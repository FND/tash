export function render(macro, params, container) {
	let nodes = macro(params);
	if(!nodes.pop) {
		nodes = [nodes];
	}

	container.innerHTML = "";
	nodes.forEach(node => {
		container.appendChild(node);
	});
}
