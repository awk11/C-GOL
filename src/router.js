var controllers = require('./controllers'); 
var mid = require('./middleware');

//connects everything on the server side together
//specified functions get called when certain requests are made
var router = function(app){
	app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
	app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
	app.get("/logout", mid.requiresLogin, controllers.Account.logout);
	app.get("/C-GOL", mid.requiresLogin, controllers.Sim.simPage);
	app.post("/C-GOL", mid.requiresLogin, controllers.Sim.make);
	app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;