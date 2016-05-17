//middleware code

//makes sure that the user is logged in before redirecting to the app
var requiresLogin = function(req, res, next) {
	if(!req.session.account) {
		return res.redirect('/');
	}
	
	next();
};


//makes sure the user is logged out before they can access the login or sign up page
var requiresLogout = function(req, res, next) {
	if(req.session.account) {
		return res.redirect('/C-GOL');
	}
	
	next();
};

//equiresthat the website using http secure
var requiresSecure = function(req, res, next) {
	if(req.headers['x-forwarded-proto'] != 'https') {
		return res.redirect('https://' + req.hostname + req.url);
	}
	next();
};

//bypasses the security check in certain circumstances
var bypassSecure = function(req, res, next) {
	next();
};


//connects all of the exports
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

//determines whether the app is in testing or out in the wild
if(process.env.NODE_ENV === "production") {
	module.exports.requiresSecure = requiresSecure;
}
else {
	module.exports.requiresSecure = bypassSecure;
}