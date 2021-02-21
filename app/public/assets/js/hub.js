if (!document.cookie.match(/token=.{32}/)) {
	window.location.href = '/';
}

$(document).ready(function() {

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

	$.ajax({
		url: "./api/assignments",
		type: "POST",
		success: (e) => {
			addAssignments(e);
		},
		error: (e) => {
			defaultError.message = "Error reading assignments."
			notyf.error(defaultError);
		}
	});

	function addAssigment(e) {
		let div = '<div class="col-4-sm col-3-lg"><div class="card">';
		div    += '<h5 class="card-title">' + e["name"] + ' (' + e["class"] + ' )</h5><p class="card-content">';
		div    += 'Due by: ' + e["due"] + ' / Closes: ' + e["closes"];
		div    += '<br>';
		div    += 'Completed ' + e["completed"];
		div    += '</p></div></div>';

		$("#assignments").append();
	}

	function addAssigments(e) {
		for (let assignment of e) {
			let div = '<div class="col-4-sm col-3-lg"><div class="card">';
			div    += '<h5 class="card-title">' + assignment["name"] + ' (' + assignment["class"] + ' )</h5><p class="card-content">';
			div    += 'Due by: ' + assignment["due"] + ' / Closes: ' + assignment["closes"];
			div    += '<br>';
			div    += 'Completed ' + assignment["completed"];
			div    += '</p></div></div>';

			$("#assignments").append();
		}
	}

	$('#custom_btn').click(function() {
		let name = $('#custom-modal input#name').val();
		let class_name = $('#custom-modal input#class').val();
		let due = $('#custom-modal input#due').val();
		let close = $('#custom-modal input#close').val();

		if (password == $('#custom-modal input#password_validate').val()) {
			$.ajax({
				type: "POST",
				url: "register",
				data: {
					class: class_name,
					name: name,
					due: due,
					close: close
				},
				success: function(data) {
					addAssigment({class: class_name, name: name, due: due, close: close});
				},
				error: function(data) {
					defaultError.message = data.responseJSON["msg"];
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
});
