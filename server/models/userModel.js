const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    OTP: { type: String },
    emailVerified: {type: Boolean, default: false},
    stocksList: {type: [{type: String}], default: [] },
}, { collection: "users" });

const model = mongoose.model("Users", UserSchema);

module.exports = model;