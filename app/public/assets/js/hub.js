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
});
