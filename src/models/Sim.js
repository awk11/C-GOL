var mongoose = require('mongoose');
var _ = require('underscore');

//the simulation model
var SimModel;

//trims the name variable so that it doesnt have any extra whitespace
var setName = function(name){
	return _.escape(name).trim();
};

//the simulation schema
var SimSchema = new mongoose.Schema({

	//the name of the simulation
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	//the array of x-xoordinates in the simulations cell array for cells that are alive
	dataX: {
		type: Array,
		required: true
	},
	
	//the array of y-xoordinates in the simulations cell array for cells that are alive
	dataY: {
		type: Array,
		required: true
	},
	
	//the first rule for the simulation
	ruleDieL: {
		type: Number,
		min: 0,
		default: 2,
		required: true
		
	},
	
	//the second rule for the simulation
	ruleDieH: {
		type: Number,
		min: 0,
		default: 3,
		required: true
	},
	
	//the third rule for the simulation
	ruleBirth: {
		type: Number,
		min: 0,
		default: 3,
		required: true
	},
	
	//the simulations owner
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	
	//the date and time it was created
	createdData: {
		type: Date,
		default: Date.now
	}
});

//used to send all of the simulations data back to the cient
SimSchema.statics.findByOwner = function(ownerId, callBack){
	
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return SimModel.find(search).select("dataX dataY name ruleDieL ruleDieH ruleBirth").exec(callBack);
};

//connects the model to the schema
SimModel = mongoose.model('Sim', SimSchema);

//exports them
module.exports.SimModel = SimModel;
module.exports.SimSchema = SimSchema;





