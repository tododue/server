if (!document.cookie.match(/token=.{32}/)) {
	window.location.href = '/';
}

function getFormattedDate(date, justTime = false) {
	if (justTime) {
		return ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
	} else {
		return ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}
}

$(document).ready(function() {

	let assignments;

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

	function addAssigment(assignment) {
		assignments.push(assignment);
		addAssignmentsCourse();
	}

	function addAssignments24h() {
		$("#assignments").empty();
		let div = '<table><thead><tr><th>Name</th><th>Class</th><th>Due</th><th class="text-center">Actions</th></tr></thead><tbody>';
		for (let assignment of assignments) {
			div += '<tr><td>' + assignment["name"] + '</td><td>' + assignment["class"] + '</td>';
			div += '<td>' + getFormattedDate(new Date(assignment["due"]), true) + '</td><td>' + ((assignment["close"] != assignment["due"]) ? ' / Closes: ' + getFormattedDate(new Date(assignment["close"])) : '') + '</td>';
			div += ((assignment["note"] != null) ? '</tr><tr class="note"><td colspan="4"><strong>^^^ NOTE:</strong> ' + assignment["note"] + '</td>' : '');
			div += '</tr>';
		}
		div += '</tbody></table>';
		$("#assignments").append(div);
	}

	function addAssignmentsList() {
		$("#assignments").empty();
		let div = '<table><thead><tr><th>Name</th><th>Class</th><th>Due</th><th>Actions</th></tr></thead><tbody>';
		for (let assignment of assignments) {
			div += '<tr><td>' + assignment["name"] + '</td><td>' + assignment["class"] + '</td>';
			div += '<tr><td>' + assignment["due"] + '</td><td>' + ((typeof assignment["closes"] != 'undefined') ? ' / Closes: ' + assignment["closes"] : '') + '</td>';
			div += '</tr>';
		}
		div += '</tbody></table>';
		$("#assignments").append(div);
	}

	function addAssignmentsCourse() {
		$("#assignments").empty();
		for (let assignment of assignments) {
			let div = '<div class="col-4-sm col-2-lg less-gutter"><div class="card">';
			div    += '<h5 class="card-title">' + assignment["name"] + ' (' + assignment["class"] + ' )</h5><p class="card-content">';
			div    += 'Due by: ' + assignment["due"] + ((typeof assignment["closes"] != 'undefined') ? ' / Closes: ' + assignment["closes"] : '');
			div    += '<br>';
			div    += ((assignment["complete"]) ? 'mark incomplete' : 'complete');
			div    += '</p></div></div>';

			$("#assignments").append(div);
		}
	}

	function callAPI(action) {
		$("main > div").removeClass("active");
		$("#" + action).addClass("active");
		switch (action) {
			case "hub":
				$.ajax({
					url: "./api/assignmentsDueIn24h",
					type: "GET",
					success: function(data) {
						assignments = data;
						addAssignments24h();
					},
					error: function(data) {
						if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
						notyf.error(defaultError);
					}
				});
				break;
			case "assignments-list":
				$.ajax({
					url: "./api/assignments",
					type: "POST",
					success: function(data) {
						assignments = data;
						addAssignmentsList();
					},
					error: function(data) {
						if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
						notyf.error(defaultError);
					}
				});
				break;
			case "courses":
				$.ajax({
					url: "./api/assignments",
					type: "POST",
					success: function(data) {
						assignments = data;
						addAssignmentsCourse();
					},
					error: function(data) {
						if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
						notyf.error(defaultError);
					}
				});
				break;
			case "profile":
				$.ajax({
					url: "./api/profile",
					type: "POST",
					success: function(data) {
						// assignments = data;
					},
					error: function(data) {
						if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
						notyf.error(defaultError);
					}
				});
				break;
		}
	}

	if (window.location.hash.length > 0) {
		if ($('.nav-link a[data-link="' + window.location.hash.substr(1) + '"]').length > 0) {
			let element = $('.nav-link a[data-link="' + window.location.hash.substr(1) + '"]').parent().addClass('active');
			switch (window.location.hash.substr(1)) {
				case "hub":
				case "assignments-list":
				case "courses":
					callAPI(window.location.hash.substr(1));
					break;
			}
		}
	} else {
		$("ul.navbar li").removeClass("active");
		$("li a[data-link='hub']").parent().addClass("active");
		callAPI("hub");
	}

	$(".nav-link").on("click", function() {
		$("ul.navbar li").removeClass("active");
		let section = $(this).children().data("link");
		$(this).addClass("active");

		switch (section) {
			case "logout":
				console.log("logout requested");
				break;
			default:
				callAPI(section);
				break;
		}
	});

	$('#custom_btn').click(function() {
		let name = $('#custom-modal input#name').val();
		let class_name = $('#custom-modal input#class').val();
		let due = $('#custom-modal input#due').val();
		let close = $('#custom-modal input#close').val();

		if (password == $('#custom-modal input#password_validate').val()) {
			$.ajax({
				type: "POST",
				url: "api/createCustomAssignment",
				data: {
					class: class_name,
					name: name,
					due: due,
					close: close
				},
				success: function(data) {
					let action = (window.location.hash.substr(1) > 0) ? window.location.hash.substr(1) : 'hub';
					callAPI(action);
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
});
