let map;
!function($, _, TweenMax, getComputedStyle, parseInt, window, undefined) {
	map = {
		mouseX: 0,
		mouseY: 0,
		scale: 100,
		width: 0,
		height: 0,
		miniMapDrag: querySelector('#mini-map-drag'),
		miniMapParent: querySelector('#mini-map-drag-parent'),
		dragMap: {},
		init,
		setScale,
		setPosition,
		setZoomPosition,
		wheelZoomIn,
		wheelZoomOut,
		centerMapAt,
		setCenteredCoords,
		centerMap,
		applyBounds,
	}
	const SCALE_IN_MAX = 50 // ZOOM OUT
	const SCALE_DEFAULT = 100
	const SCALE_OUT_MAX = 150 // ZOOM IN
	const SCALE_INCREMENT = 10
	const MIN_MAP_WIDTH = map.miniMapParent.offsetWidth * (1 / (SCALE_IN_MAX * .01))
	const MAX_MAP_HEIGHT = map.miniMapParent.offsetHeight * (1 / (SCALE_IN_MAX * .01))
	///////////////////////////////////////////
	$('#mini-map-drag')
		.on('wheel', handleWheel)
		.on('dblclick', wheelZoomIn)
	$('#mini-map-center').on('click', centerMap)
	$('#mini-map-party').on('click', handleCenterParty)

	function init() {
		map.dragMap = Draggable.create(map.miniMapDrag, {
			bounds: querySelector('#mini-map-drag-parent'),
			throwProps: true,
			throwResistance: 250,
			edgeResistance: 1,
			force3D: true,
			onThrowUpdate: throwUpdate,
			onThrowComplete: throwUpdate,
		})[0]
		// width
		map.width = Math.max(MIN_MAP_WIDTH, dungeon.map.width)
		map.height = Math.max(MAX_MAP_HEIGHT, dungeon.map.height)
		// set dynamic style
		map.miniMapDrag.style.width = dungeon.map.width + 'px'
		map.miniMapDrag.style.height = dungeon.map.height + 'px'
		map.centerMapAt()
	}
	function handleWheel(e) {
		if (e.originalEvent.deltaY < 0) map.wheelZoomIn(e)
		else map.wheelZoomOut(e)
		typeof e.preventDefault === 'function' && e.preventDefault()
	}
	function setPosition() {
		TweenMax.to(map.miniMapDrag, .75, {
			x: -map.mouseX,
			y: -map.mouseY,
		})
	}
	function wheelZoomIn(e) {
		if (map.scale >= SCALE_OUT_MAX) return
		map.setZoomPosition(e)
		map.scale += SCALE_INCREMENT
		if (map.scale > SCALE_OUT_MAX) map.scale = SCALE_OUT_MAX
		map.setScale()
	}
	function wheelZoomOut(e) {
		if (map.scale <= SCALE_IN_MAX) return
		map.setZoomPosition(e)
		map.scale -= SCALE_INCREMENT
		if (map.scale < SCALE_IN_MAX) map.scale = SCALE_IN_MAX
		map.setScale()
	}
	function setZoomPosition(e) {
		if (typeof e.originalEvent.offsetX === 'number') {
			map.mouseX = e.originalEvent.offsetX
			map.mouseY = e.originalEvent.offsetY
		}
	}
	function setScale() {
		TweenMax.set(map.miniMapDrag, {
			transformOrigin: (map.mouseX) + 'px ' + (map.mouseY) + 'px',
		})
		TweenMax.to(map.miniMapDrag, .5, {
			scale: map.scale * .01,
			onUpdate: applyBounds,
			onComplete: applyBounds,
		})
	}
	function applyBounds() {
		typeof map.dragMap.applyBounds === 'function' && map.dragMap.applyBounds()
	}
	function throwUpdate() {
		map.applyBounds()
	}
	function centerMap() {
		map.setCenteredCoords()
		map.scale = SCALE_DEFAULT
		map.setScale()
		map.setPosition()
	}
	function centerMapAt(pos) {
		// centers at position requested, otherwise centers map
		if (typeof pos === 'object') {
			let maxX = (map.width - map.miniMapParent.offsetWidth) * .5
			let maxY = (map.height - map.miniMapParent.offsetHeight) * .5
			// constrain x
			if (pos.x < -maxX) pos.x = -maxX
			else if (pos.x > maxX) pos.x = maxX
			// constrain y
			if (pos.y < -maxY) pos.y = -maxY
			else if (pos.y > maxY) pos.y = maxY
			map.mouseX = (map.miniMapDrag.offsetWidth * .5) - (map.miniMapParent.offsetWidth * .5) + (pos.x)
			map.mouseY = (map.miniMapDrag.offsetHeight * .5) - (map.miniMapParent.offsetHeight * .5) + (pos.y)
		}
		else {
			map.setCenteredCoords()
		}
		map.scale = SCALE_DEFAULT
		map.setScale()
		map.setPosition()
	}
	function handleCenterParty() {
		map.centerMapAt({
			x: dungeon.positionX,
			y: dungeon.positionY,
		})
	}
	function setCenteredCoords() {
		map.mouseX = (map.miniMapDrag.offsetWidth * .5) - (map.miniMapParent.offsetWidth * .5)
		map.mouseY = (map.miniMapDrag.offsetHeight * .5) - (map.miniMapParent.offsetHeight * .5)
	}
}($, _, TweenMax, getComputedStyle, parseInt, window);