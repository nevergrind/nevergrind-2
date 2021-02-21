let map;
!function($, _, TweenMax, undefined) {
	map = {
		mouseX: 0,
		mouseY: 0,
		originX: 0,
		originY: 0,
		scale: 100,
		miniMap: querySelector('#mini-map-drag'),
		miniMapParent: querySelector('#mini-map-drag-parent'),
		dragMap: {},
		init,
		setScale,
		setOrigins,
		setPosition,
		setZoomPosition,
		zoomIn,
		zoomOut,
		centerMap,
	}
	const MIN_SCALE = 100
	const MAX_SCALE = 200
	const SCALE_INCREMENT = 10
	const DRAG_OFFSET = -14
	const ZOOM_IN_EVENT_DATA = { originalEvent: { deltaY: -650, preventDefault: ng.noop}}
	const ZOOM_OUT_EVENT_DATA = { originalEvent: { deltaY: 650, preventDefault: ng.noop}}
	///////////////////////////////////////////
	$('#mini-map-drag').on('wheel', handleWheel)
		.on('dblclick', zoomIn)
	$('#mini-map-center').on('click', centerMap)
	$('#mini-map-zoom-in').on('click', clickZoomIn)
	$('#mini-map-zoom-out').on('click', clickZoomOut)

	function init() {
		map.dragMap = Draggable.create(map.miniMap, {
			bounds: querySelector('#mini-map-drag-parent'),
			/*throwProps: true,
			throwResistance: 250,*/
			edgeResistance: 1,
			force3D: true,
		})[0]
		setCenteredCoords()
	}
	function handleWheel(e) {
		if (e.originalEvent.deltaY < 0) map.zoomIn(e)
		else map.zoomOut(e)
		typeof e.preventDefault === 'function' && e.preventDefault()
	}
	function setTransformOrigin(tween) {
		TweenMax.set(map.miniMap, {
			transformOrigin: tween.x + 'px ' + tween.y + 'px',
		})
	}
	function setPosition() {
		TweenMax.to(map.miniMap, .75, {
			x: -map.mouseX,
			y: -map.mouseY,
		})
	}
	function setOrigins() {
		map.originX = map.mouseX
		map.originY = map.mouseY
	}
	function setZoomPosition(e) {
		map.setOrigins()
		map.mouseX = e.originalEvent.offsetX
		map.mouseY = e.originalEvent.offsetY
	}
	function boundCoordX(val) {
		if (val > map.miniMap.offsetWidth) val = map.miniMap.offsetWidth
		else if (val < 0) val = 0
		return val
	}
	function boundCoordY(val) {
		if (val > map.miniMap.offsetHeight) val = map.miniMap.offsetHeight
		else if (val < 0) val = 0
		return val
	}
	function getClickCoords() {
		// click center of map
		let x = window.innerWidth * .89
		let y = window.innerHeight * .775
		return document.elementFromPoint(x, y)
	}
	function clickZoomIn() {
		const wheelEvent = $.Event( 'wheel', ZOOM_IN_EVENT_DATA);
		let el = getClickCoords()
		// el.dispatchEvent(new MouseEvent('wheel', wheelEvent));
		$(el).trigger(wheelEvent)
	}
	function clickZoomOut() {
		const wheelEvent = $.Event( 'wheel',ZOOM_OUT_EVENT_DATA);
		let el = getClickCoords()
		// el.dispatchEvent(new MouseEvent('wheel', wheelEvent));
		$(el).trigger(wheelEvent)
	}
	function zoomIn(e) {
		map.setZoomPosition(e)
		map.scale += SCALE_INCREMENT
		if (map.scale > MAX_SCALE) map.scale = MAX_SCALE
		map.setScale()
	}
	function zoomOut(e) {
		map.setZoomPosition(e)
		map.scale -= SCALE_INCREMENT
		if (map.scale < MIN_SCALE) map.scale = MIN_SCALE
		map.setScale()
	}
	function setScale() {
		let tween = {
			x: map.originX,
			y: map.originY,
		}
		TweenMax.to(tween, .5, {
			x: map.mouseX,
			y: map.mouseY,
			onUpdate: setTransformOrigin,
			onUpdateParams: [tween]
		})
		TweenMax.to(map.miniMap, .5, {
			scale: map.scale * .01,
			onUpdate: applyBounds,
			onComplete: applyBounds,
		})
	}
	function applyBounds() {
		map.dragMap.applyBounds()
	}
	function setCenteredCoords() {
		map.mouseX = (map.miniMap.offsetWidth * .5) - map.miniMapParent.offsetWidth * .5
		map.mouseY = (map.miniMap.offsetHeight * .5) - map.miniMapParent.offsetHeight * .5
	}
	function centerMap() {
		map.setOrigins()
		setCenteredCoords()
		map.scale = MIN_SCALE
		map.setScale()
		map.setPosition()
	}
}($, _, TweenMax);