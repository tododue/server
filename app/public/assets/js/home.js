$(document).ready(function() {
	MicroModal.init({
		onClose: () => resetInputs()
	});
	var notyf = new Notyf();

	let defaultError = {
		"duration": 8000,
		"message": "Error.",
		"dismissable": true,
		"position": {
			"x": "right",
			"y": "top"
		},
		"ripple": false
	};

	$('#form input').on('change', function() {
		if ($(this).val() !== '') { $(this).addClass('hascontent'); }
		else { $(this).removeClass('hascontent'); }
	});

	$('#form input').on('keydown', function(e) {
		let k = (e.which) ? e.which : e.keyCode;
		if (k == 13) {
			let inputs = $(this).closest('#form').find('input');
			let eval = true;

			inputs.each(function(i) {
				if ($(this).val().length == 0) { eval = false; }
			})

			if (eval) {
				console.log($(this));
				let btn = $(this).parents('.modal__container').find('button.submit');
				$(btn).click();
			}
		}
	});

	function resetInputs() {
		$('input#password').removeClass('hascontent').val('');
		$('input#password_validate').removeClass('hascontent').val('');
	};

	$('#signup_btn').click(function() {
		let username = $('#signup-modal input#username').val();
		let email = $('#signup-modal input#email').val();
		let password = $('#signup-modal input#password').val();

		if (password == $('#signup-modal input#password_validate').val()) {
			$.ajax({
				type: "POST",
				url: "register",
				data: {
					username: username,
					email: email,
					password: password
				},
				success: function(data) {
					if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; notyf.error(defaultError); }
					else { window.location.href = '/hub'; }
				},
				error: function(data) {
					defaultError.message = data["responseJSON"]["msg"];
					notyf.error(defaultError);
				}
			});
		} else {
			notyf.error({
				"duration": 4000,
				"message": "Please enter the same password.",
				"dismissable": true,
				"position": {
					"x": "right",
					"y": "top"
				},
				"ripple": false
			});
		}
	});

	$('#login_btn').click(function() {
		let username = $('#login-modal input#username').val();
		let password = $('#login-modal input#password').val();

		$.ajax({
			type: "POST",
			url: "login/",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
					document.cookie = "token=" + data["token"];
					window.location.href = '/hub';
			},
			error: function(data) {
				if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
				notyf.error(defaultError);
			}
		});
	});

});
