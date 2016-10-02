"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  Model = new Schema({
    address: String,
    lat: Number,
    lng: Number,
	district_name: String,
	plate_name: String,
    community_name: String,
    community_id: {
      type: 'String',
      index: { unique: true }  
    },
	community_price: Number
  });

Model.index({
  community_name: 1
});

module.exports = mongoose.model("community", Model);