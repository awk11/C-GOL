"use strict";

//displays the error messages onto the screen as appropriate
function handleError(message) {
	$("#simErrorMessage").text(message);
	$("#simErrorMessage").css({'display': 'block'});
}

//sends new simulation data to the server through an ajax call
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

//the event listener for the save new simulation button
//collects all the data about the current state of the 
//simulation and sends ti in the proper format to the ajax call function
$("#makeSimButton").on("click", function(e) {
	e.preventDefault();
	
	//hides the error message until it's needed
	$("#simErrorMessage").css({'display': 'none'});
	
	//makes sure the rules are logical
	if($("#rule1").val() > $("#rule2").val()) {
		handleError("Lower bound must be less than upper bound");
		return false;
	}
	
	//makes sure the simulation has a name
	if($('#simName').val() == ''){
		handleError("Must give new Simulation a name");
		return false;
	}
	
	//sets up the dataX and dataY arrays for the save
	var dataX = [];
	var dataY = [];
	
	for(var i = 0; i < app.main.cells.length; i++)
	{
		for (var j = 0; j < app.main.cells[0].length; j++)
		{
			if(app.main.cells[i][j].isAlive)
			{
				dataX.push(i);
				dataY.push(j);
			}
		}
	}
	
	//sends everything in the proper format to the ajax function
	sendAjax($("#simSetupForm").attr("action"), "dataX="+dataX+"&dataY="+dataY+"&"+$("#simSetupForm").serialize());
	
	return false;
});