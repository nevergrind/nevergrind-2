// dom.js
var dom;
(function(){
	dom = {
		body: getById('body'),
		bgmusic: getById('bgmusic'),
		msg: getById('msg'),
		chatInput: getById('chat-input'),
		chatLog: getById('chat-log'),
		itemTooltipCursorImg: getById('item-tooltip-cursor-img')
	}
})();