import { setTimeout } from 'node:timers/promises';

import config from '../config.json' with { type: "json" };

let globalApiDelay = 0;// in milli seconds

// check if defined and type check
function mwValidateCookiesSession(req, res, next) {
  if(typeof req.cookies[config.COOKIES.KEY.USER_ID] === 'string'
      && typeof req.cookies[config.COOKIES.KEY.SESSION_ID] === 'string') {
    next();
    return;
  }
  res.status(401).send('Invalid Cookies');
}

function mwInject(key, value) {
  return (req, res, next) => {
    res.locals[key] = value;
    next();
  };
}

async function mwDelayApiRequests(req, res, next) {
  if(!globalApiDelay) {
    next();
    return;
  }

  await setTimeout(globalApiDelay);
  next();
}

// Validates and Transforms delay string to 'number'
function mwValidateTransformDelay(req, res, next) {
  const delay = req.body[config.JSON.KEY.DELAY];

  let n = NaN;
  if(typeof delay !== 'string'
      || !(/^\d+$/.test(delay))
      || !(n = Number(delay))
      || n < config.DELAY_MIN
      || n > config.DELAY_MAX) {
    res.status(400).end();
    return;
  }

  req.body[config.JSON.KEY.DELAY] = n;
  next();
}

function setSessionCookies(userId, sessionId, res) {
  if(!sessionId) {
    res.clearCookie(
      config.COOKIES.KEY.USER_ID,
      config.COOKIES.OPTIONS.USER_ID);
    res.clearCookie(
      config.COOKIES.KEY.SESSION_ID,
      config.COOKIES.OPTIONS.SESSION_ID);
    return;
  }
  res.cookie(
    config.COOKIES.KEY.USER_ID,
    userId,
    config.COOKIES.OPTIONS.USER_ID);

  res.cookie(
    config.COOKIES.KEY.SESSION_ID,
    sessionId,
    config.COOKIES.OPTIONS.SESSION_ID);
}

function getApiUser(req, res) {
  const userId = req.cookies[config.COOKIES.KEY.USER_ID];
  const sessionId = req.cookies[config.COOKIES.KEY.SESSION_ID];

  if(typeof userId !== 'string' || typeof sessionId !== 'string') {
    res.status(400).end();
    return;
  }

  const db = res.locals.db;

  const dbRes = db.getUser(userId);
  if(dbRes.err) {
    if(dbRes.err === 'notfound') {
      res.status(404).end();
      return;
    }
    if(dbRes.err === 'invalid') {
      res.status(400).end();
      return;
    }
    res.status(500).end();
    return;
  }

  const user = {};
  user[config.JSON.KEY.USER_ID] = dbRes.user.id;
  user[config.JSON.KEY.USER_ROLE] = dbRes.user.role;
  res.status(200).json(user);
}

function postApiLogin(req, res) {
  const id = req.body[config.JSON.KEY.USER_ID];
  const password = req.body[config.JSON.KEY.PASSWORD];

  if(typeof id !== 'string' || typeof password !== 'string') {
    res.status(400).end();
    return;
  }

  const db = res.locals.db;
  const dbRetUser = db.getUser(id);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid') {
      res.status(400).send('Invalid Arguments');
      return;
    }
    if(dbRetUser.err === 'notfound') {
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

  // TODO: add security
  const sessionId = 1;
  const err = db.setSessionId(id, sessionId);
  if(err) {
    if(err === 'invalid arguments') {
      res.status(400).send('Invalid Arguments');
      return;
    }
    if(err === 'user not found') {
      res.status(400).send('User Not Found');
      return;
    }
    res.status(500).end();
    return;
  }
  setSessionCookies(id, sessionId, res);

  res.status(200).end();
}

function postApiLogout(req, res, next) {
  const uId = req.cookies[config.COOKIES.KEY.USER_ID];
  const sId = req.cookies[config.COOKIES.KEY.SESSION_ID];

  const db = res.locals.db;
  // database transaction should be atomic
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid') {
      res.status(400).send();
      return;
    }
    if(dbRetUser.err === 'notfound') {
      res.status(404).send();
      return;
    }
    res.status(500).end();
    return;
  }

  if(dbRetUser.user.sessionId !== sId) {
    res.status(401).send('Not Logged In');
    return;
  }

  const err = db.setSessionId(null, res);
  if(err) {
    res.status(500).end();
    return
  }
  setSessionCookies(uId, 0, res);
  res.status(200).end();
}

function putApiDelay(req, res, next) {
  const uId = req.cookies[config.COOKIES.KEY.USER_ID];
  const sId = req.cookies[config.COOKIES.KEY.SESSION_ID];

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

  const oldDelay = globalApiDelay;
  globalApiDelay = req.body[config.JSON.KEY.DELAY];

  res.status(200).json({
    [config.JSON.KEY.DELAY_OLD] : oldDelay.toString(10),
    [config.JSON.KEY.DELAY]     : globalApiDelay.toString(10),
  });
}

function getApiUsers(req, res, next) {
  const uId = req.cookies[config.COOKIES.KEY.USER_ID];
  const sId = req.cookies[config.COOKIES.KEY.USER_ID];

  const db = res.locals.db;
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid') {
      res.status(400).send('Invalid User Id');
      return;
    }
    if(dbRetUser.err === 'notfound') {
      res.status(404).send('User Not Found');
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
  const users = [];
  for(let u of dbRetUsers.users) {
    users.push({
      [config.JSON.KEY.USER_ID]   : u.id,
      [config.JSON.KEY.USER_ROLE] : u.role,
    });
  }
  res.status(200).json(users);
}

function getApiDelay(req, res) {
  const uId = req.cookies[config.COOKIES.KEY.USER_ID];
  const sId = req.cookies[config.COOKIES.KEY.SESSION_ID];

  const db = res.locals.db;
  // database transaction should be atomic
  const dbRetUser = db.getUser(uId);
  if(dbRetUser.err) {
    if(dbRetUser.err === 'invalid') {
      res.status(400).send('Invalid User Id');
      return;
    }
    if(dbRetUser.err === 'notfound') {
      res.status(404).send('User Not Found');
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

  res.status(200).json({ [config.JSON.KEY.DELAY]: globalApiDelay });
}

export default function routerApi(express, db) {
  const router = express.Router();

  router.use(mwDelayApiRequests);

  /* Returns the logged in user, or 404
   *
   * Required
   * - valid logged in cookies
   * Response
   * - User, on sucess
   * - 404/400, if no valid login found
   * - 500, on server error
   */
  router.get('/user',
    mwInject('db', db),
    getApiUser);
  /* Required
   * - general/admin login
   */
  router.get('/users',
    mwValidateCookiesSession,
    mwInject('db', db),
    getApiUsers);

  /* Request
   * - valid admin login cookies
   *
   * Response
   * - { config.JSON.KEY.DELAY: value }
   */
  router.get('/delay',
    mwValidateCookiesSession,
    mwInject('db', db),
    getApiDelay);

  /* Behaviour
   * - if already logged in switches user
   *
   * Required
   * - json body with 'JSON.KEY.USER_ID', 'JSON.KEY.PASSWORD' properties
   */
  router.post('/login',
    mwInject('db', db),
    postApiLogin);

  /* Required
   * - general/admin login
   */
  router.post('/logout',
    mwValidateCookiesSession,
    mwInject('db', db),
    postApiLogout);

  /* Required
   * - admin login
   * - json body with 'config.JSON.KEY.DELAY' property with value
   *   in milli seconds
   */
  router.put('/delay',
    mwValidateCookiesSession,
    mwValidateTransformDelay,
    mwInject('db', db),
    putApiDelay);

  router.all('/*',
    (req, res) => { res.redirect(404, '/') });

  return router;
}
