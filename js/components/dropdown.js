var dropdown;
(function(_, $, undefined) {
	dropdown = {
		toggle,
		hideMenu,
	};
	var style
	//////////////////////////////////////////////
	function toggle() {
		style = getComputedStyle(this.nextElementSibling)
		this.nextElementSibling.style.display = style.display === 'none' ? 'flex' : 'none'
	}
	function hideMenu() {
		this.parentNode.style.display = 'none'
	}
})(_, $);