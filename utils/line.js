const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('qs');
const secureCompare = require('secure-compare');

const channel_id = process.env.CHANNEL_ID;
const secret = process.env.CHANNEL_SECRET;
const callback = process.env.CALLBACK_URL;
const scope = process.env.SCOPE;

//console.log(channel_id, secret, callback, scope)

const random = () => crypto.randomBytes(20).toString('hex')

const urlCombine = (state, nonce) => {
  const id = encodeURIComponent(channel_id);
  const cb = encodeURIComponent(callback);
  const sp = encodeURIComponent(scope);
  let url = `https://access.line.me/oauth2/v2.1/authorize?`
  url += `response_type=code&client_id=${id}&redirect_uri=${cb}`
  url += `&scope=${sp}&bot_prompt=normal&state=${state}&nonce=${nonce}`
  return url
}

const issueAccessToken = (code) => {
  const url = `https://api.line.me/oauth2/v2.1/token`;
  const form = {
    grant_type: "authorization_code",
    code,
    redirect_uri: callback,
    client_id: channel_id,
    client_secret: secret
  }
  return axios({
    method: 'post',
    url,
    data: qs.stringify(form),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

const lineLogin = {
  auth: (req, res, next) => {
    let state = req.session.lineLoginState = random();
    let nonce = req.session.lineLoginNonce = random();
    let url = urlCombine(state, nonce);
    res.redirect(url);
  },
  handleCb: async (req, res, next) => {
    const code = req.query.code;
    const state = req.query.state;

    // check code & state
    if(!code) return res.send('code error')
    // if(!secureCompare(req.session.lineLoginState, state)) {
    //   return res.send('state error')
    // }
    try {
      const token = await issueAccessToken(code)
      // if(!secureCompare(decode.nonce, req.session.lineLoginNonce)){
      //   return res.send('nonce error')
      // }

      delete req.session.lineLoginState
      delete req.session.lineLoginNonce
      
      return res.redirect('/?token=' + token.data.id_token)
      //return res.send(obj)
    } catch(error){
      return res.send(error)
    }
  },
  verify: (req, res, next) => {
    try {
      const decode = jwt.verify(
        req.body.token,
        secret,
        {
          audience: channel_id,
          issuer: 'https://access.line.me',
          algorithms: ['HS256']
        }
      );
      res.send(decode.name)
   } catch (err) {
    res.status(404).send(err)
   }
  },
  checkCookie: (req, res, next) => {
    try {
      const decode = jwt.verify(
        req.cookies.info,
        secret,
        {
          audience: channel_id,
          issuer: 'https://access.line.me',
          algorithms: ['HS256']
        }      
      );
      next()
    } catch(err){
      res.status(403).send('need login')
    }
  }
}

module.exports = lineLogin

