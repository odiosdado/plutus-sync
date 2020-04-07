import mongoose from 'mongoose';
import config from '../constants/config';

const setupConnection = async () => {
  mongoose.connect(config.mongodb.uri, config.mongodb.options);
  mongoose.Promise = global.Promise;
  let db = mongoose.connection;
  db.on('Error', console.error.bind(console, 'MongoDB connection error:'));
}

export default setupConnection;
