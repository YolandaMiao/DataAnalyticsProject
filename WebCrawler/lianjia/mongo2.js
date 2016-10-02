var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lianjia_xiaoqu');
var Community = require('./models/lianjia_xiaoqu');

module.exports = {
  community: Community
};