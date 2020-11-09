const linelogin = require('./../utils/line')

exports.login = async (req, res, next) => {
  linelogin.auth(req, res, next)
};

exports.verify = async (req, res, next) => {
  const name = linelogin.verify(req, res, next)
  res.send(name)
}

exports.lineCb = (req, res, next) => {
  linelogin.handleCb(req, res, next)
}
