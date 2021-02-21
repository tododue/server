if (!document.cookie.match(/token=.{32}/)) {
	window.location.href = '/';
}

function getFormattedDate(date, justTime = false, withTime = false) {
	if (withTime) {
		return ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
	}
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
			div += '<tr data-assignment-finished="' + ((assignment["overrideCompleteSet"] == true) ? 1 : 0) + '" data-assignment-id="' + assignment["id"] + '" data-assignment-name="' + assignment["name"] + '" data-assignment-class="' + assignment["class"] + '" data-assignment-due="' + assignment["due"] + '" data-assignment-close="' + assignment["close"] + '">';
			div += '<td>' + assignment["name"] + '</td><td>' + assignment["class"] + '</td>';
			div += '<td>' + getFormattedDate(new Date(assignment["due"]), true) + ((assignment["close"] != assignment["due"]) ? ' / Closes: ' + getFormattedDate(new Date(assignment["close"])) : '') + '</td>';
			div += '<td class="td-actions"><span class="modal-edit" data-micromodal-trigger="edit-assignment-modal">Edit</span>' + ((assignment["complete"]) ? '<span class="modal-unfinished">Mark Unfinished</span>' : '<span class="modal-finished">Mark Finished</span>') + '</td>';
			div += ((assignment["note"] != null) ? '</tr><tr class="note"><td colspan="4"><strong>^^^ NOTE:</strong> ' + assignment["note"] + '</td>' : '');
			div += '</tr>';
		}
		div += '</tbody></table>';
		$("#assignments").append(div);
		MicroModal.init();
	}

	function addAssignmentsList() {
		$("#assignments").empty();
		let div = '<table><thead><tr><th>Name</th><th>Class</th><th>Due</th><th>Actions</th></tr></thead><tbody>';
		for (let assignment of assignments) {
			div += '<tr data-assignment-finished="' + ((assignment["overrideCompleteSet"] == true) ? 1 : 0) + '" data-assignment-id="' + assignment["id"] + '" data-assignment-name="' + assignment["name"] + '" data-assignment-class="' + assignment["class"] + '" data-assignment-due="' + assignment["due"] + '" data-assignment-close="' + assignment["close"] + '">';
			div += '<td>' + assignment["name"] + '</td><td>' + assignment["class"] + '</td>';
			div += '<td>' + getFormattedDate(new Date(assignment["due"]), false, true) + ((typeof assignment["closes"] != 'undefined') ? ' / Closes: ' + getFormattedDate(new Date(assignment["due"]), false, true) : '') + '</td>';
			div += '<td class="td-actions"><span class="modal-edit" data-micromodal-trigger="edit-assignment-modal">Edit</span>' + ((assignment["complete"]) ? '<span class="modal-unfinished">Mark Unfinished</span>' : '<span class="modal-finished">Mark Finished</span>') + '</td>';
			div += ((assignment["note"] != null) ? '</tr><tr class="note"><td colspan="4"><strong>^^^ NOTE:</strong> ' + assignment["note"] + '</td>' : '');
			div += '</tr>';
		}
		div += '</tbody></table>';
		$("#assignments").append(div);
		MicroModal.init();
	}

	function addAssignmentsCourse() {
		$("#assignments").empty();
		for (let assignment of assignments) {
			let div = '<div class="col-4-sm col-3-lg"><div class="card" ';
			div	   += 'data-assignment-finished="' + ((assignment["overrideCompleteSet"] == true) ? 1 : 0) + '" data-assignment-id="' + assignment["id"] + '" data-assignment-name="' + assignment["name"] + '" data-assignment-class="' + assignment["class"] + '" data-assignment-due="' + assignment["due"] + '" data-assignment-close="' + assignment["close"] + '">';
			div    += '<h5 class="card-title">' + assignment["name"] + ' (' + assignment["class"] + ')</h5><p class="card-content">';
			div    += 'Due by: ' + getFormattedDate(new Date(assignment["due"])) + ((typeof assignment["closes"] != 'undefined') ? ' / Closes: ' + getFormattedDate(new Date(assignment["closes"])) : '');
			div    += '<br>';
			div    += '<div class="actions"><span class="modal-edit" data-micromodal-trigger="edit-assignment-modal">Edit</span>' + ((assignment["complete"]) ? '<span class="modal-unfinished">Mark Unfinished</span>' : '<span class="modal-finished">Mark Finished</span>') + '</div>';
			div    += '</p></div></div>';

			$("#assignments").append(div);
		}
		MicroModal.init();
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

	$("#assignments").on("click", "span[data-micromodal-trigger='edit-assignment-modal']", function () {
		$("#edit-assignment-modal input#assignment_id").val($(this).closest("tr").data("assignment-id"));
		$("#edit-assignment-modal input#name").val($(this).closest("tr").data("assignment-name"));
		$("#edit-assignment-modal input#class").val($(this).closest("tr").data("assignment-class"));
		$("#edit-assignment-modal input#due").val(new Date($(this).closest("tr").data("assignment-due")).toJSON().slice(0,19));
		$("#edit-assignment-modal input#close").val(new Date($(this).closest("tr").data("assignment-close")).toJSON().slice(0,19));

		$("#edit-assignment-modal input#name").addClass("hascontent");
		$("#edit-assignment-modal input#class").addClass("hascontent");
	})

	$("#assignments").on("click", "span.mark-finished, span.mark-unfinished", function () {
		let id = $(this).closest("tr").data("assignment-id");
		let toggle = ($(this).closest("tr").data("assignment-finished") == true) ? 0 : 1;

		$.ajax({
			type: "POST",
			url: "api/updateAssignment",
			data: {
				id: id,
				overrideCompleteSet: toggle
			},
			success: function(data) {
				location.reload();
			},
			error: function(data) {
				defaultError.message = data["responseJSON"]["msg"];
				notyf.error(defaultError);
			}
		});
	});

	$('#edit_assignment_btn').click(function() {
		let id = $('#edit-assignment-modal input#assignment_id').val();
		let name = $('#edit-assignment-modal input#name').val();
		let class_name = $('#edit-assignment-modal input#class').val();
		let due = $('#edit-assignment-modal input#due').val();
		let close = $('#edit-assignment-modal input#close').val();

		if (name.length > 0 && class_name.length > 0) {
			$.ajax({
				type: "POST",
				url: "api/updateAssignment",
				data: {
					id: id,
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
				"message": "Please enter valid information.",
				"dismissable": true,
				"position": {
					"x": "right",
					"y": "top"
				},
				"ripple": false
			});
		}
	});

	$('#add_assignment_btn').click(function() {
		let name = $('#add-assignment-modal input#name').val();
		let class_name = $('#add-assignment-modal input#class').val();
		let due = $('#add-assignment-modal input#due').val();
		let close = $('#add-assignment-modal input#close').val();

		if (name.length > 0 && class_name.length > 0) {
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
					location.reload();
				},
				error: function(data) {
					defaultError.message = data["responseJSON"]["msg"];
					notyf.error(defaultError);
				}
			});
		} else {
			notyf.error({
				"duration": 4000,
				"message": "Please enter valid information.",
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
