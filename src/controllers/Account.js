var models = require('../models');

//ges the account model
var Account = models.Account;

//renders the login page when called
var loginPage = function(req, res){
	res.render('login', { csrfToken: req.csrfToken() });
};

//renders the signup page when called
var signupPage = function(req, res){
	res.render('signup', { csrfToken: req.csrfToken() });
};

//logs the user out when called
var logout = function(req, res){
	req.session.destroy();
	res.redirect('/');
};

//attemots to log the user in
var login = function(req, res) {
	if(!req.body.username || !req.body.pass){
		return res.status(400).json({error: "All fields are required"});
	}
	
	Account.AccountModel.authenticate(req.body.username, req.body.pass, function(err, account){
		if(err || !account){
			return res.status(400).json({error: "Incorrect username and/or password"});
		}
		
		req.session.account = account.toAPI();
		
		//redirects to the app page upon successful login
		res.json({redirect: '/C-GOL'});
		
	});
};


//attempts to sig the user up
var signup = function(req, res) {
	//checks to make sure that all of the fields are filled in
	if(!req.body.username || !req.body.pass || !req.body.pass2){
		return res.status(400).json({error: "All fields are required"});
	}
	
	//checks to make sure both password inputs match
	if(req.body.pass !== req.body.pass2){
		return res.status(400).json({error: "Both password fields need to match"});
	}
	
	//create the new account
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash){
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err) {
			if(err){
				console.log(err);
				return res.status(400).json({error: 'Something weird happened, username may be taken'});
			}
			
			req.session.account = newAccount.toAPI();
			
			res.json({redirect: '/C-GOL'});
		});
		
	});
};

//all of the exports to link everything to the router
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;