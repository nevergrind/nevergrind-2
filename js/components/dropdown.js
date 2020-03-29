var dropdown;
(function(_, $, undefined) {
	dropdown = {
		isOpen: false,
		toggle,
		hide,
		hideMenu,
	};
	var style
	//////////////////////////////////////////////
	function toggle(event) {
		style = getComputedStyle(this.nextElementSibling)
		if (style.display === 'none') show(this.nextElementSibling)
		else hide(this.nextElementSibling)
		event.stopPropagation()
	}
	function show(element) {
		dropdown.isOpen = true
		element.style.display = 'flex'
	}
	function hide(element) {
		element = element ? [element] : querySelectorAll('.ng-dropdown')
		dropdown.isOpen = false
		element.forEach(setHide)
	}
	function setHide(element) {
		element.style.display = 'none'
	}
	function hideMenu() {
		dropdown.isOpen = false
		this.parentNode.style.display = 'none'
	}
})(_, $);