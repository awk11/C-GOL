"use strict";

function handleError(message) {
	$("#simErrorMessage").text(message);
	$("#simErrorMessage").css({'display': 'block'});
}

function sendAjax(action, data) {
	$.ajax({
		cache: false,
		type: "POST",
		url: action,
		data: data,
		dataType: "json",
		success: function(result, status, xhr) {
			$("#simErrorMessage").css({'display': 'none'});

			window.location = result.redirect;
		},
		error: function(xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
		
			handleError(messageObj.error);
		}
	});        
}

$("#makeSimButton").on("click", function(e) {
	e.preventDefault();

	$("#simErrorMessage").css({'display': 'none'});

	if($("#rule1").val() > $("#rule2").val()) {
		handleError("Lower bound must be less than upper bound");
		return false;
	}
	
	sendAjax($("#simSetupForm").attr("action"), $("#simSetupForm").serialize());
	
	return false;
});


function repeatHistorySim(r1, r2, r3, csrfToken){
		sendAjax("/C-GOL", "ruleDieL="+r1+"&ruleDieH="+r2+"&ruleBirth="+r3+"&_csrf="+csrfToken);
}