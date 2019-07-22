var modal;
(function() {
	modal = {
		isOpen: 0,
		overlay: getById('modal-overlay'),
		wrap: getById('modal-wrap'),
		headerContents: {
			playerIdleBoot: '<div id="modal-header">Disconnected</div>',
			deleteCharacter: '<div id="modal-header">Delete '+ create.name +'?</div>',
		},
		bodyContents: {
			playerIdleBoot:
			'<div id="modal-body">'+
				'<p>You have been disconnected from the server.</p>'+
			'</div>',
			deleteCharacter:
			'<div id="modal-body">'+
				'<p>Are you sure you want to delete this character?</p>'+
			'</div>',
		},
		show: show,
		hide: hide,
		header: header,
		body: body,
		footer: footer,
	};
	////////////////////////////////
	function show(e) {
		modal.isOpen = 1;
		e.camelKey = ng.camel(e.key);
		var s = '<div class="stag-blue">'+
					modal.header(e) +
					modal.body(e) +
					(e.hideFooter ? '' : modal.footer(e)) +
				'</div>';
		modal.wrap.innerHTML = s;

		modal.isOpen = true;
		TweenMax.to(modal.overlay, .3, {
			startAt: {
				visibility: 'visible',
				alpha: 0
			},
			alpha: 1
		});
		TweenMax.to(modal.wrap, .3, {
			startAt: {
				visibility: 'visible',
				alpha: 0,
				top: 30
			},
			alpha: 1,
			top: 50
		});
		// assign events
		$("#modal-dismiss, #modal-overlay").on('mousedown', function(){
			modal.hide();
		});
		// confirm event actions
		$('#modal-wrap').on('mousedown', '#delete-character-confirm', function(){
			create.deleteCharacter();
		});
		if (e.focus) {
            setTimeout(function () {
                $("#modal-wrap input:first").focus();
            }, 100);
        }
	}
	function hide() {
		TweenMax.to([modal.overlay, modal.wrap], .3, {
			overwrite: 0,
			alpha: 0,
			onComplete: function(){
				modal.isOpen = 0;
				ng.unlock();
				TweenMax.set(this.target, {
					visibility: 'hidden'
				});
			}
		});
	}
	function header(e) {
		return modal.headerContents[e.camelKey];
	}
	function body(e) {
		return modal.bodyContents[e.camelKey];
	}
	function footer(e) {
		var str =
			'<div id="modal-footer" class="text-center">'+
				'<a id="modal-dismiss" class="ng-btn modal-buttons">Cancel</a>'+
				'<a id="'+ e.key +'-confirm" class="ng-btn modal-buttons">Confirm</a>'+
			'</div>';
		return str;
	}
})();