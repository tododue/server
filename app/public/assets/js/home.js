$(document).ready(function() {
	MicroModal.init({
		onClose: () => resetInputs()
	});
	var notyf = new Notyf();

	if (window.location.search.substr(1).length > 0) {

		let query = window.location.search.substr(1);

		let message = {
			"duration": 8000,
			"message": "Error.",
			"dismissable": true,
			"position": {
				"x": "right",
				"y": "top"
			},
			"ripple": false
		};

		switch (query) {
			case "success=logout":
				message.message = "Successfully logged out!";
				notyf.success(message);
				break;
			case "error=login":
				message.message = "Error logging you in - check your username/password?";
				notyf.error(message);
				break;
			case "error=signup":
				message.message = "Make sure you have a valid username/password (more than 5 characters)!";
				notyf.error(message);
				break;
			case "error=param":
				message.message = "Dont't go messing with the parameters now...";
				notyf.error(message);
				break;
			default:
				message.message = "Something went wrong here...let someone know please!";
				notyf.error(message);
				break;
		}
	}

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
					if (typeof data == 'string' && data.includes('error=')) { window.location.href = '/?' + data; }
					else { window.location.href = '/hub'; }
				},
				error: function(data) {
					notyf.error({
						"duration": 8000,
						"message": data["msg"],
						"dismissable": true,
						"position": {
							"x": "right",
							"y": "top"
						},
						"ripple": false
					});
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
				if (typeof data == 'string' && data.includes('error=')) { window.location.href = '/?' + data; }
				else { window.location.href = '/hub'; }
			},
			error: function(data) {
				notyf.error({
					"duration": 8000,
					"message": data["msg"],
					"dismissable": true,
					"position": {
						"x": "right",
						"y": "top"
					},
					"ripple": false
				});
			}
		});
	});

});
