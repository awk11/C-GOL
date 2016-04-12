var mongoose = require('mongoose');
var _ = require('underscore');

var SimModel;

var storeData = function(cells) {
	return cells;
};

var setName = function(name){
	return _.escape(name).trim();
};

var SimSchema = new mongoose.Schema({

	/*name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	cells: {
		type: Array,
		required: true,
		set: storeData
	},*/
	
	ruleDieL: {
		type: Number,
		min: 0,
		default: 2,
		required: true
		
	},
	
	ruleDieH: {
		type: Number,
		min: 0,
		default: 3,
		required: true
	},
	
	ruleBirth: {
		type: Number,
		min: 0,
		default: 3,
		required: true
	},
	
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	
	createdData: {
		type: Date,
		default: Date.now
	}
});

SimSchema.methods.toAPI = function(){
	return{
		name: this.name,
		cells: this.cells
	};
};

SimSchema.statics.findByOwner = function(ownerId, callBack){
	
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return SimModel.find(search).select("ruleDieL ruleDieH ruleBirth").exec(callBack);
};

SimModel = mongoose.model('Sim', SimSchema);

module.exports.SimModel = SimModel;
module.exports.SimSchema = SimSchema;





