const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session');

require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());

app.use(session({
  secret: 'test_key',
  resave: false
}));

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is on ${PORT}.`);
});
