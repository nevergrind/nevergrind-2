'use strict';
var login;
(function() {
	login = {
		lock: 0,
		email: localStorage.getItem('email'),
		token: localStorage.getItem('token'),
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
		$('#login').on('click', login.authenticate);
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
		$("#login-form-contents").on('click', '#login-btn', function(){
			login.authenticate();
		}).on('click', '#create-account', function(){
			login.createAccount();
		});
		setTimeout(function(){
			document.getElementById('login-form-contents').innerHTML =
				login.getLoginHtml();
			$("#loginWrap").attr('onSubmit', 'return login.authenticate(this)');
		});
		$("#gotoAccount").on('click', function(){
			document.getElementById('login-form-contents').innerHTML =
				login.getLoginHtml();
			$("#loginWrap").attr('onSubmit', 'return login.authenticate(this)');
		});
		$("#createAccount").on('click', function(){
			document.getElementById('login-form-contents').innerHTML =
				login.getCreateHtml();
			$("#loginWrap").attr('onSubmit', 'return login.createAccount(this)');
		});
	}
	function getLoginHtml() {
		var s =
			'<div style="margin-bottom: .2rem">Account or Email Address</div>' +
			'<input name="username"' +
				'type="text"' +
				'id="loginEmail"' +
				'class="loginInputs"' +
				'maxlength="255"' +
				'placeholder="Account or Email Address"' +
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
			'<div for="rememberMe" style="display: flex; justify-content: center; align-items: center; margin: .2rem">' +
				'<input type="checkbox" id="rememberMe" name="rememberMe" checked> Remember Me' +
			'</div>' +
			'<input id="login-btn" type="submit" value="Login" class="ng-btn" />' +
			'<div class="error-msg"></div>';
		return s;
	}
	function getCreateHtml() {
		var s =
			'<div style="margin: .2rem">Email Address</div>' +
			'<input name="username" ' +
				'type="text" ' +
				'id="loginEmail" ' +
				'class="loginInputs" ' +
				'maxlength="255" ' +
				'auto-complete="disabled" '+
				'placeholder="Account or Email Address" ' +
				'required="required" ' +
				'spellcheck="false"/>' +
			'<div style="margin: .2rem">Password</div>' +
			'<input name="password" ' +
				'type="password" ' +
				'id="password" ' +
				'auto-complete="disabled" '+
				'class="loginInputs" ' +
				'maxlength="20" ' +
				'placeholder="Password" required="required" />' +
			'<div class="create-account" style="margin: .2rem">Account Name</div>' +
			'<input name="account" ' +
				'type="text" ' +
				'name="account" ' +
				'auto-complete="disabled" '+
				'id="loginAccount" ' +
				'class="loginInputs create-account" ' +
				'maxlength="16" ' +
				'placeholder="Account Name" ' +
				'required="required" /></div>' +
			'<input id="create-account" type="submit" value="Create" class="ng-btn" style="margin: 1rem 0 .2rem" />' +
			'<div class="error-msg"></div>';
		return s;
	}
	function createAccount() {
		if (login.lock) {
			return false;
		}
		var pw = $("#password").val(),
			acc = $("#loginAccount").val();

		if (acc.length < 2) {
			login.msg("Your account name must be more than two characters long.");
			return false;
		}
		if (acc.length > 16) {
			login.msg("Your account name must be less than 16 characters long.");
			return false;
		}
		var tempAcc = acc.replace('_', '');
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
		var email = $("#loginEmail").val().toLowerCase();
		var account = acc.toLowerCase();
		$.ajax({
			type: 'POST',
			url: app.loginUrl + 'server/account/create-account.php',
			data: {
				email: email,
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
	function authenticate(f) {
		if (login.authenticationLock === true) {
			return false;
		}
		var email = $("#loginEmail").val().toLowerCase();
		var password = $("#password").val();
		if (email.length < 3) {
			login.msg("This is not a valid email address.");
			return false;
		}
		if (password.length < 6 && !login.token) {
			login.msg("Passwords must be at least six characters long.");
			return false;
		}
		if ($("#rememberMe").prop('checked')){
			localStorage.setItem('email', email);
			localStorage.setItem('token', login.token);
		}
		else {
			localStorage.removeItem('email');
		}
		login.msg("Connecting to server...");
		login.authenticationLock = true;

		$.ajax({
			type: 'POST',
			url: app.loginUrl + 'server/authenticate.php',
			data: {
				email: email,
				password: password
			}
		}).done(function(data){
			if (data === "Login successful!"){
				location.reload();
			}
			else {
				if (!suppress){
					login.msg(data);
					console.error(data);
				}
			}
		}).fail(function(data) {
			login.msg(data.statusText);
		}).always(function(){
			login.authenticationLock = false;
		});
		return false; // prevent form submission
	}
	function notLoggedIn() {
		$("#login-modal").css({
			visibility: 'visible'
		});
		$("#logout").remove();
	}
})();