var modal;
(function() {
	modal = {
		isOpen: 0,
		overlay: getElementById('modal-overlay'),
		wrap: getElementById('modal-wrap'),
		playerIdleBoot: {
			header: function() {
				return '<div id="modal-header">Disconnected</div>';
			},
			body: function() {
				return '<div id="modal-body">' +
					'<p>You have been disconnected from the server.</p>' +
				'</div>';
			}
		},
		deleteCharacter: {
			header: function() {
				return '<div id="modal-header">Delete '+ create.name +'?</div>';
			},
			body: function() {
				return '<div id="modal-body">' +
					'<p>Are you sure you want to delete '+ create.name +'?</p>' +
				'</div>';
			}
		},
		show,
		hide
	};
	// public ////////////////////////////////////////////////////////////////////
	function show(e) {
		modal.isOpen = 1;
		var camelKey = _.camelCase(e.key);
		var html = '<div class="stag-blue">'+
					// header
					(typeof modal[camelKey].header === TYPE.FUNCTION ?
						modal[camelKey].header() : '') +
					modal[camelKey].body() +
					// footer
					(typeof modal[camelKey].footer === TYPE.FUNCTION ?
						modal[camelKey].footer() : defaultFooter(e)) +
				'</div>';
		modal.wrap.innerHTML = html;

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
				y: -20
			},
			alpha: 1,
			y: 0
		});
		// assign events
		$("#modal-dismiss, #modal-overlay").on('click', function(){
			modal.hide();
		});
		// confirm event actions
		$('#modal-wrap').on('click', '#delete-character-confirm', create.deleteCharacter);
		if (e.focus) {
            delayedCall(.1, function () {
                $("#modal-wrap input:first").focus();
            });
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
	// private ////////////////////////////////////////////////////////////////////
	function defaultFooter(e) {
		var str =
			'<div id="modal-footer" class="text-center">'+
				'<a id="modal-dismiss" class="ng-btn modal-buttons">Cancel</a>'+
				'<a id="'+ e.key +'-confirm" class="ng-btn modal-buttons">Confirm</a>'+
			'</div>';
		return str;
	}
})();