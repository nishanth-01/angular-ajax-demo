import http from 'node:http';
import express from 'express';
import parseurl from 'parseurl';
import cookieParser from 'cookie-parser';

import DataBase from './database.mjs';
import Config from './server.config.mjs'

// options should remain same for the cookies to work properly
const cookies = {
  userId: {
    key: 'user_id',
    options: {
      maxAge: undefined,// set 'undefined' for session cookies
      httpOnly: true,
    },
  },
  sessionId: {
    key: 'session_id',
    options: {
      maxAge: undefined,// set 'undefined' for session cookies
      httpOnly: true,
    },
  },
};

main();


// check if defined and its of type 'string'
function mwValidateCookiesSession(req, res, next) {
  if(typeof req.cookies[cookies.userId.key] === 'string'
      && typeof req.cookies[cookies.sessionId.key] === 'string') {
    next();
    return;
  }
  res.status(400).send('Invalid Cookies');
}

function mwInject(key, value) {
  return (req, res, next) => {
    res.locals[key] = value;
    next();
  };
}

// check if defined and its type
// if valid transforms 'string' to 'number'
function mwValidateTransformQueryDelay(req, res, next) {
  const delayString = req.query[QUERY.key.delay];

  if(typeof delayString !== 'string') {
    res.status(400).send('Missing/Invalid URL Query');
    return;
  }

  if(!/^\d+$/s.test(delayString)) {
    res.status(400).send('Invalid URL Query');
    return;
  }

  const delayNumber = Number(delayString);

  if(delayNumber === NaN) {
    res.status(400).send('Invalid URL Query');
    return;
  }
  if(delayNumber > MAX_DELAY) {
  }
  if(delayNumber < MIN_DELAY) {}
  req.query[QUERY.key.delay] = n;
  next();
  return;
}

function setSessionCookies(sessionId, res) {
  if(!sessionId) {
    res.clearCookie(cookies.sessionId.key, cookies.options.login);
    return;
  }
  res.cookie(cookies.key.sessionId, sessionId, cookies.options.login);
}

// if already logged in reset validity
function postApiLogin(req, res, next) {
  let id, password;
  if(res.body) {
    if(typeof res.body[JSON_KEY.userId] === 'string') {
      id = res.body[JSON_KEY.userId];
    }
    if(typeof res.body[JSON_KEY.userPassword] === 'string') {
      password = res.body[JSON_KEY.userPassword];
    }
  }

  const db = res.locals.db;
  const dbRetUser = db.getUser(id);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid arguments') {
      res.status(400).send('Invalid Arguments');
      return;
    }
    if(dbRetUser.err === 'user not found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }

  if(dbRetUser.user.password !== password) {
    res.status(401).send('Wrong Credentials');
    return;
  }

  const dbResponse = db.setSessionId(id, sessionId);
  if(dbResponse.err) {
    if(dbResponse.err === 'invalid arguments') {
      res.status(400).send('Invalid Arguments');
      return;
    }
    if(dbResponse.err === 'user not found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }
  // TODO: add security
  const sessionId = 1;
  setSessionCookies(sessionId, res);

  res.status(200).end();
}

function postApiLogout(req, res, next) {
  const uId = req.cookies[cookies.userId.key];
  const sId = req.cookies[cookies.sessionId.key];

  const db = res.locals.db;
  // database transaction should be atomic
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid arguments') {
      res.status(400).send('Invalid User Id');
      return;
    }
    if(dbRetUser.err === 'user not found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }

  if(dbRetUser.user.sessionId !== sId) {
    res.status(400).send('Not Logged In');
    return;
  }

  const dbRetSid = db.setSessionId(null, res);
  if(dbRetSid.err) {
    res.status(500).end();
    return
  }
  setSessionCookies(0, res);
  res.status(200).end();
}

function putApiDelay(req, res, next) {
  const uId = req.cookies[cookies.key.userId];
  const sId = req.cookies[cookies.key.sessionId];

  const db = res.locals.db;
  // database transaction should be atomic
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid arguments') {
      res.status(400).send('Invalid User Id');
      return;
    }
    if(dbRetUser.err === 'User Not Found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }

  if(dbRetUser.user.sessionId !== sId) {
    res.status(401).end();
    return;
  }
  if(dbRetUser.user.role !== 'admin') {
    res.status(403).send('Requires Admin Access');
    return;
  }
  delay = req.query.delay;
  res.status(200).end();
}

function getApiUsers(req, res, next) {
  const uId = req.cookies[cookies.key.userId];
  const sId = req.cookies[cookies.key.sessionId];

  const db = res.locals.db;
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid arguments') {
      res.status(400).send('Invalid User Id');
      return;
    }
    if(dbRetUser.err === 'User Not Found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }

  const dbRetUsers = db.getUsers();
  if(dbRetUsers.err) {
    res.status(500).end();
    return;
  }
  res.status(200).json({
    userCount: dbRetUsers.users.length,
    userList: dbRetUsers.users
  });
}

function invalidMethodHandler(req, res, next) {
  res.status(405).end();
}

function invalidPathHandler(req, res, next) {
  res.status(400).send(`invalid path for ${req.method}`);
}

function main() {
  const app = express();
  const db = new DataBase();

  // TODO: close db
  db.init();

  // common middlewares
  app.use(express.json());
  app.use(cookieParser());
  // static files server
  app.use(express.static('/static', {
    //fallthrough: false,
    dotfiles: 'deny'
  }));

  // end points
  app.get('/api/users',
    mwValidateCookiesSession,
    mwInject('db', db),
    getApiUsers
  );
  app.get('*', invalidPathHandler);

  app.post('/api/login', postApiLogin);
  app.post('/api/logout',
    mwValidateCookiesSession,
    mwInject('db', db),
    postApiLogout
  );
  app.post('*', invalidPathHandler);

  app.put('/api/delay',
    mwValidateCookiesSession,
    mwValidateTransformQueryDelay,
    mwInject('db', db),
    putApiDelay
  );
  app.put('*', invalidPathHandler);

  // exception
  app.all('*', invalidMethodHandler);

  const server = http.createServer(app);
  server.listen(Config.port, Config.host, () => {
    const addr = server.address();
    console.log(`server started at ${addr.address}:${addr.port}`);
  });
}
