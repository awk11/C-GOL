"use strict";

//the client class
$(document).ready(function() {

	//displays the error messages onto the screen as appropriate
    function handleError(message) {
        $("#errorMessage").text(message);
        $("#errorMessage").css({'display': 'block'});
    }
    
	//sends the user data through ajax to the server
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#errorMessage").css({'display': 'none'});

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                //var messageObj = JSON.parse(xhr.responseText);
            
                handleError(xhr.responseText);
            }
        });
    }
    
	//event listener for the sign up button
	//takes the data the user entered to sign up , formats it properly, and sends it over to the ajax function
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
    
		//hides the error message
        $("#errorMessage").css({'display': 'none'});;
		
		//makes sure everything is filled out
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }
        
		//makes sure the two password inputs match
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }
		
		//sends the user data in the proper format to the ajax function
        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });
	
	//event listener for the login button
    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
		
		//hides the error message
        $("#errorMessage").css({'display': 'none'});
		
		//makes sure everything is filled out
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }
		
		//sends the user data in the proper format to the ajax function
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });
});
