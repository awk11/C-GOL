var crypto = require('crypto');
var mongoose = require('mongoose');

//the account model
var AccountModel;
var iterations = 10000;
var saltLength = 64;
var keyLength = 64;

//the account schema
var AccountSchema = new mongoose.Schema({
	//the accounts username
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-\.]{1,16}$/
    },
	
	salt: {
		type: Buffer,
		required: true
	},
    
	//the accounts password
    password: {
        type: String,
        required: true
    },
    
	//the accounts meta data
    createdData: {
        type: Date,
        default: Date.now
    }

});

//sends the account in json format
AccountSchema.methods.toAPI = function() {
    return {
        username: this.username,
        _id: this._id 
    };
};

//validates the users password
AccountSchema.methods.validatePassword = function(password, callback) {
	var pass = this.password;
	
	crypto.pbkdf2(password, this.salt, iterations, keyLength, 'sha1', function(err, hash) {
		if(hash.toString('hex') !== pass) {
			return callback(false);
		}
		return callback(true);
	});
};

//user look up based on their username
AccountSchema.statics.findByUsername = function(name, callback) {

    var search = {
        username: name
    };

    return AccountModel.findOne(search, callback);
};

//makes account more secure with some encryption
AccountSchema.statics.generateHash = function(password, callback) {
	var salt = crypto.randomBytes(saltLength);
	
	crypto.pbkdf2(password, salt, iterations, keyLength, 'sha1', function(err, hash){
		return callback(salt, hash.toString('hex'));
	});
};

//authenticates the account
AccountSchema.statics.authenticate = function(username, password, callback) {
	return AccountModel.findByUsername(username, function(err, doc) {

		if(err)
		{
			return callback(err);
		}

        if(!doc) {
            return callback();
        }

        doc.validatePassword(password, function(result) {
            if(result === true) {
                return callback(null, doc);
            }
            
            return callback();
        });
        
	});
};

//attaches the schema to the model
AccountModel = mongoose.model('Account', AccountSchema);

//exports everything
module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
