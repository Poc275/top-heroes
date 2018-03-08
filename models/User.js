var mongoose = require('mongoose');
var options = { discriminatorKey: 'kind' };
var jwt = require('jsonwebtoken');
var config;
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

exports.UserSchema = new mongoose.Schema({
	// _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	_id: false,
	username: { type: String, required: true },
	// name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	provider: { type: String, required: true },
	id: { type: String, required: true },
	cards: { type: Array, required: true },
	level: { type: Number, required: true },
	played: { type: Number, required: true },
	won: { type: Number, required: true },
	lost: { type: Number, required: true },
	xp: { type: Number, required: true },
	boon: { type: Number, required: true },
	role: { type: String, required: true }
}, options);

this.UserSchema.methods.generateJwt = function() {
	var secret = process.env.JwtSecret || config.jwt.secret;
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		username: this.username,
		cards: this.cards,
		level: this.level,
		played: this.played,
		won: this.won,
		lost: this.lost,
		xp: this.xp,
		boon: this.boon,
		role: this.role,
		exp: parseInt(expiry.getTime() / 1000)
	}, secret);
};