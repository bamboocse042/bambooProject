const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true},
    usersList: {type: [{type: String}], default: []},
}, { collection: "stocks" });

const model = mongoose.model("stocks", StockSchema);

module.exports = model;