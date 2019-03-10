const accHeads = document.querySelectorAll("ul li .head");

const handleClick = (() => {
	let lastActiveNode = null;
	return e => {	
		const body = e.target.parentNode.querySelector(".body");
		if(body === lastActiveNode) {
			body.classList.remove("active");
			lastActiveNode = null;
		}else {
			lastActiveNode && lastActiveNode.classList.remove("active");
			body.classList.add("active");
			lastActiveNode = body;
		}
	}
})();


accHeads.forEach(el => {
	el.addEventListener("click", handleClick);
});