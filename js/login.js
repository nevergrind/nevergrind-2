'use strict';
var a;
var d;
var i;
var j;
var s;
var x;
var y;
var z;
var el;
var el2;
var arr;
var str;
var key;
var val;
var foo;
var bar;
var html;
var index;
var login;
(function() {
	login = {
		lock: 0,
		fadeTimer: new TweenMax.delayedCall(0, ''),
		focusInput: false,
		authenticationLock: false,
		msg: msg,
		init: init,
		fadeOut: fadeOut,
		notLoggedIn: notLoggedIn,
		authenticate: authenticate,
		getLoginHtml: getLoginHtml,
		createAccount: createAccount,
		getCreateHtml: getCreateHtml,
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

		setTimeout(function(){
			document.getElementById('login-form-contents').innerHTML = login.getLoginHtml();
		});

		$("#gotoAccount").on('click', function(){
			document.getElementById('login-form-contents').innerHTML = login.getLoginHtml();
		});

		$("#createAccount").on('click', function(){
			document.getElementById('login-form-contents').innerHTML = login.getCreateHtml();
		});
	}
	function getLoginHtml() {
		var s =
			'<div style="margin-bottom: .2rem">Account</div>' +
			'<input name="username"' +
				'type="text"' +
				'id="account"' +
				'class="loginInputs"' +
				'maxlength="255"' +
				'placeholder="Account Name"' +
				'required="required"' +
				'spellcheck="false"/>' +
			'<div style="margin: .2rem">Password</div>' +
			'<input name="password"' +
				'type="password"' +
				'id="password"' +
				'class="loginInputs"' +
				'maxlength="20"' +
				'auto-complete="current-password"' +
				'placeholder="Password"' +
				'required="required" />' +
			'</div>' +
			'<input id="login-btn" type="submit" value="Login" class="ng-btn" />' +
			'<div class="error-msg"></div>';
		return s;
	}
	function getCreateHtml() {
		var s =
			'<div style="margin: .2rem">Account</div>' +
			'<input type="text" ' +
				'id="account" ' +
				'class="loginInputs" ' +
				'maxlength="16" ' +
				'auto-complete="disabled" '+
				'placeholder="Enter Account Name" ' +
				'required="required" ' +
				'spellcheck="false"/>' +
			'<div style="margin: .2rem">Password</div>' +
			'<input type="password" ' +
				'id="password" ' +
				'auto-complete="disabled" '+
				'class="loginInputs" ' +
				'maxlength="20" ' +
				'placeholder="Password" required="required" />' +
			'<input id="create-account" type="submit" value="Create" class="ng-btn" style="margin: 1rem 0 .2rem" />' +
			'<div class="error-msg"></div>';
		return s;
	}
	function createAccount() {
		if (login.lock) {
			return false;
		}
		var pw = $("#password").val();
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
		if (pw.length < 6) {
			login.msg("Your password must be at least six characters long.");
			return false;
		}
		login.msg("Connecting to server...");
		login.lock = 1;
		$.ajax({
			type: 'POST',
			url: app.url + 'server/account/create-account.php',
			data: {
				account: account,
				password: pw
			}
		}).done(function(data) {
			if (data.indexOf("Account Created") === -1){
				// something went wrong
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
		var account = $("#account").val().toLowerCase();
		var password = $("#password").val();
		if (account.length < 3) {
			login.msg("This is not a valid account name.");
			return false;
		}
		if (password.length < 6 && !login.token) {
			login.msg("Passwords must be at least six characters long.");
			return false;
		}
		login.msg("Connecting to server...");
		login.authenticationLock = true;
		$.post(app.url + 'server/authenticate.php', {
			account: account,
			password: password
		}).done(function(data){
			if (data === "Login successful!"){
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