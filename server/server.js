const express = require('express');
const logger = require('morgan');
const path = require('path');
// const routes = require('./controllers');
const compression = require('compression');
const sequelize = require('./config/connection');
const {authMiddleware} = require('./utils/auth');
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = process.env.PORT || 3001;

const app = express();

const sess = {
  secret: 'pineapple',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secret: 'superSecret',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(logger('dev'));
app.use(session(sess));
app.use(compression());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

process.env.NODE_ENV === 'production' &&
  app.use(express.static(path.join(__dirname, '../client/build')));

// app.use(routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
