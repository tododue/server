if (!document.cookie.match(/token=.{32}/)) {
	window.location.href = '/';
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

	function addAssignmentsList() {
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
		switch (action) {
			case "hub":
				$.ajax({
					url: "./api/assignmentDueIn24h",
					type: "POST",
					success: function(data) {
						assignments = data;
						addAssignments24h();
					},
					error: function(data) {
						console.log(data);
						if (typeof data["responseJSON"]["msg"] == 'string') { defaultError.message = data["responseJSON"]["msg"]; }
						notyf.error(defaultError);
					}
				});
				break;
			case "assignments":
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
		if ($('.li[data-link="' + window.location.hash.substr(1) + '"]').length > 0) {
			let element = $('.li[data-link="' + window.location.hash.substr(1) + '"]');
			element.addClass('active');
			switch (window.location.hash.substr(1)) {
				case "hub", "assignments", "courses":
					break;
			}
		}
	} else {
		$("li[data-link='hub']").addClass("active");
		callAPI("hub");
	}

	$(".data-link").on("click", function() {
		$("ul.navbar li").removeClass("active");
		let section = $(this).data("link");
		$(this).parent().addClass("active");

		window.location.hash = '#' + section;

		switch (section) {
			case "logout":
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
					addAssigment({class: class_name, name: name, due: due, close: close});
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
