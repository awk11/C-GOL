var _ = require('underscore');
var models = require('../models');

//gets the simulation model
var Sim = models.Sim;

//gets all of the saved simulation data and displays the simulation app page
var simPage = function(req, res){
	
	Sim.SimModel.findByOwner(req.session.account._id, function(err, docs){
		
		if(err){
			console.log(err);
			return res.status(400).json({error: 'Something weird happened'});
		}
		
		res.render('sim', {csrfToken: req.csrfToken(), sims: docs, user: req.session.account.username});
	});
	
};

//svaes new simulations when called
var makeNewSim = function(req, res){
	
	//extra check to ensure that the rules are logical
	if(req.body.ruleDieL > req.body.ruleDieH){
		return res.status(400).json({error: "Lower bound must be less than upper bound"});
	}
	
	//extra check to ensure that the simulation has a name
	if(req.body.name == '')
		return res.status(400).json({error: "Must give new Simulation a name"});
	
	
	//sets all of the new simulation data into a temporary variable
	var simData = {
		dataX: req.body.dataX,
		dataY: req.body.dataY,
		name: req.body.name,
		ruleDieL: req.body.ruleDieL || 2,
		ruleDieH: req.body.ruleDieH || 3,
		ruleBirth: req.body.ruleBirth || 3,
		owner: req.session.account._id
	};
	
	//creates a new simulation model with all of the data
	var newSim = new Sim.SimModel(simData);
	
	//saves the new user-created simulation
	newSim.save(function(err){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'Something weird happened'});
		}
		
		res.json({redirect: "/C-GOL"});
	});
	
};

//exprts the function to be callable through the router
module.exports.simPage = simPage;
module.exports.make = makeNewSim;