var mongoose = require('mongoose');
//mongoose.connect('mongodb://0.0.0.0:27017/hospital');
mongoose.connect('mongodb://localhost/community');
//var Hospital = require('./models/hospital');
var Community = require('./models/community');

module.exports = {
  community: Community
};