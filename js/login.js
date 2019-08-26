'use strict';

var login;
(function() {
	login = {
		lock: 0,
		account: localStorage.getItem('account'),
		fadeTimer: new TweenMax.delayedCall(0, ''),
		focusInput: false,
		authenticationLock: false,
		msg,
		init,
		fadeOut,
		notLoggedIn,
		authenticate,
		setLoginHtml,
		createAccount,
		setCreateHtml,
	};
	//////////////////////////////
	function init() {
		// events
		$(".loginInputs").on('focus', function() {
			login.focusInput = true;
		}).on('blur', function() {
			login.focusInput = false;
		}).on('keydown', function(e){
			// hit enter
			console.info(e, e.keyCode);
			if(e.keyCode === 13){
				login.authenticate();
			}
		});
		// delegate login events
		$("#login-form-contents").on('click', '#login-btn', login.authenticate)
			.on('click', '#create-account', login.createAccount);

		setLoginHtml();

		$("#gotoAccount").on('click', setLoginHtml);

		$("#createAccount").on('click', setCreateHtml);
	}
	function setLoginHtml() {
		var html =
			'<div style="margin-bottom: .2rem">Account</div>' +
			'<input name="username"' +
				'type="text"' +
				'id="account"' +
				'class="loginInputs"' +
				'maxlength="255"' +
				'placeholder="Account Name"' +
				'required="required"' +
				'spellcheck="false"/>' +
			'<input id="login-btn" type="submit" value="Login" class="ng-btn" />' +
			'<div class="error-msg"></div>';
		getById('login-form-contents').innerHTML = html;
		if (login.account !== null) {
			$('#account').val(login.account);
		}
	}
	function setCreateHtml() {
		var html =
			'<div style="margin: .2rem">Account</div>' +
			'<input type="text" ' +
				'id="account" ' +
				'class="loginInputs" ' +
				'maxlength="16" ' +
				'auto-complete="disabled" '+
				'placeholder="Enter Account Name" ' +
				'required="required" ' +
				'spellcheck="false"/>' +
			'<input id="create-account" type="submit" value="Create" class="ng-btn" style="margin: 1rem 0 .2rem" />' +
			'<div class="error-msg"></div>';
		getById('login-form-contents').innerHTML = html;
	}
	function createAccount() {
		if (login.lock) {
			return false;
		}
		var account = $("#account").val().toLowerCase();

		if (account.length < 3) {
			login.msg("Your account name must be more than two characters long.");
			return false;
		}
		if (account.length > 16) {
			login.msg("Your account name must be less than 16 characters long.");
			return false;
		}
		var tempAcc = account.replace('_', '');
		if (tempAcc.match(/[a-z0-9]/gi, '').length < tempAcc.length) {
			login.msg("Your account name should only contain letters, numbers, and underscores.");
			return false;
		}
		login.msg("Connecting to server...");
		login.lock = 1;
		$.post(app.url + 'account/create-account.php', {
			account: account
		}).done(function(data) {
			if (!data.includes("Account Created")){
				// something went wrong
				localStorage.setItem('account', account);
				login.msg(data);
			}
			else {
				login.msg("Account Created! Reloading!");
				setTimeout(function(){
					location.reload();
				}, 100);
			}
		}).fail(function() {
			login.msg("There was a problem communicating with the server.");
		}).always(function() {
			login.lock = 0;
		});
		return false; // prevent form submission
	}
	function fadeOut() {
		login.fadeTimer.kill();
		login.fadeTimer = TweenMax.to('.error-msg', 0, {
			opacity: 1,
			height: 'auto',
			display: 'block',
			onComplete: function(){
				TweenMax.to('.error-msg', 1, {
					delay: 8,
					transformOrigin: '50% 0',
					transformPerspective: 500,
					rotationX: -90,
					height: 0,
					opacity: 0,
					onComplete: function(){
						$(".error-msg").html('');
					}
				});
			}
		});
	}
	function msg(msg) {
		var str = "<div>" + msg + "</div>";
		$(".error-msg").html(str);
		login.fadeOut();
		TweenMax.set('.error-msg', {
			transformOrigin: '50% 0',
			transformPerspective: 500,
			rotationX: 0
		});
	}
	function authenticate() {
		if (login.authenticationLock === true) {
			return false;
		}
		var account = _.toLower($("#account").val());
		if (account.length < 3) {
			login.msg("This is not a valid account name.");
			return false;
		}
		login.msg("Connecting to server...");
		login.authenticationLock = true;
		$.post(app.url + 'account/authenticate.php', {
			account: account
		}).done(function(data){
			console.info('data', data.success, data.account);
			if (data.success){
				localStorage.setItem('account', account)
				location.reload();
			}
			else {
				login.msg(data);
				console.error(data);
			}
		}).fail(function(data) {
			login.msg(data.statusText);
		}).always(function(){
			login.authenticationLock = false;
		});
	}
	function notLoggedIn() {
		$("#login-modal").css({
			visibility: 'visible'
		});
		$("#logout").remove();
	}
})();