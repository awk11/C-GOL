var _ = require('underscore');
var models = require('../models');

var Sim = models.Sim;

var simPage = function(req, res){
	
	Sim.SimModel.findByOwner(req.session.account._id, function(err, docs){
		
		if(err){
			console.log(err);
			return res.status(400).json({error: 'Something weird happened'});
		}
		
		res.render('sim', {csrfToken: req.csrfToken(), sims: docs});
	});
	
};

var makeNewSim = function(req, res){
	
	if(req.body.ruleDieL > req.body.ruleDieH){
		return res.status(400).json({error: "Lower bound must be less than upper bound"});
	}
	
	var simData = {
		ruleDieL: req.body.ruleDieL || 2,
		ruleDieH: req.body.ruleDieH || 3,
		ruleBirth: req.body.ruleBirth || 3,
		owner: req.session.account._id
	};
	
	var newSim = new Sim.SimModel(simData);
	
	newSim.save(function(err){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'Something weird happened'});
		}
		
		res.json({redirect: "/C-GOL"});
	});
	
};

module.exports.simPage = simPage;
module.exports.make = makeNewSim;