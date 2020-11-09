const db = require('../utils/db');
const { Shop } = db.connect('common');

exports.create = async (req, res, next) => {
  try {
    const { name, add, tel, onwer } = req.body;
    const shop = new Shop({
      name,
      add,
      tel,
      onwer
    });
    await shop.save();
    res.send({ status: 'success' });
  } catch (err) {
    res.status(404).send(err);
  }
}

exports.read = async (req, res, next) => {
  try {
    const data = await Shop.find();
    res.send({ status: 'success', data });
  } catch (err) {
    res.status(404).send(err);
  }
}

exports.update = async (req, res, next) => {
  try {
    const { _id, name, add, tel, onwer } = req.body;
    const shop = await Shop.findById(_id);
    
    if(name) shop.name = name;
    if(add) shop.add = add;
    if(tel) shop.tel = tel;
    if(onwer) shop.onwer = onwer;
    
    await shop.save();
    res.send({ status: 'success' });
  } catch (err) {
    res.status(404).send(err);
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { _id } = req.body;
    await Shop.deleteOne({ _id });
    res.send({ status: 'success' });
  } catch (err) {
    res.status(404).send(err);
  }
}