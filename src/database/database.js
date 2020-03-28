import config from '../constants/config';

const mongoose = require('mongoose');

exports.setupConnection = () => {
  mongoose.connect(config.mongodb.uri, {useNewUrlParser: true});
  mongoose.Promise = global.Promise;
  let db = mongoose.connection;
  db.on('Error', console.error.bind(console, 'MongoDB connection error:'));
}
