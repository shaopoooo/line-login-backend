const mongoose = require('mongoose');

const shopSchema = require('../models/shop')

const connections = {};

exports.connect = (dbName) => {
  if (!connections[dbName]) {
   const url = `mongodb://${process.env.DB_HOST}/${dbName}`;
   const opt = { useNewUrlParser: true, useUnifiedTopology: true };
   connections[dbName] = mongoose.createConnection(url, opt);
  }
  const Shop = connections[dbName].model('shop', shopSchema);
  return { Shop }
};
