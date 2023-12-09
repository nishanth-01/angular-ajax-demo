import * as config from '../config.mjs';

// check if defined and its of type 'string'
function mwValidateCookiesSession(req, res, next) {
  if(typeof req.cookies[config.COOKIES.KEY.USERID] === 'string'
      && typeof req.cookies[config.COOKIES.KEY.SESSIONID] === 'string') {
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
  const delayString = req.query[QUERY.KEY.DELAY];

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
  req.query[QUERY.KEY.DELAY] = n;
  next();
  return;
}

function setSessionCookies(userId, sessionId, res) {
  if(!sessionId) {
    res.clearCookie(
      config.COOKIES.KEY.USERID,
      config.COOKIES.OPTIONS.USERID);
    res.clearCookie(
      config.COOKIES.KEY.SESSIONID,
      config.COOKIES.OPTIONS.SESSIONID);
    return;
  }
  res.cookie(
    config.COOKIES.KEY.USERID,
    userId,
    config.COOKIES.OPTIONS.USERID);

  res.cookie(
    config.COOKIES.KEY.SESSIONID,
    sessionId,
    config.COOKIES.OPTIONS.SESSIONID);
}

// if already logged in reset validity
function postApiLogin(req, res) {
  let id, password;
  if(res.body) {
    if(typeof res.body[JSON_KEY.userId] === 'string') {
      id = res.body[JSON_KEY.userId];
    }
    if(typeof res.body[JSON_KEY.userPassword] === 'string') {
      password = res.body[JSON_KEY.userPassword];
    }
  }

  if(!id || !password) {
    res.status(400).end();
    return;
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
  const uId = req.cookies[config.COOKIES.userId.key];
  const sId = req.cookies[config.COOKIES.sessionId.key];

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
  const uId = req.cookies[config.COOKIES.KEY.userId];
  const sId = req.cookies[config.COOKIES.KEY.sessionId];

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
  const uId = req.cookies[config.COOKIES.KEY.userId];
  const sId = req.cookies[config.COOKIES.KEY.sessionId];

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

export default function routerApi(express, db) {
  const router = express.Router();

  /* Required
   * - general/admin login
   */
  router.get('/users', mwValidateCookiesSession, mwInject('db', db), getApiUsers);

  /* Behaviour
   * - if already logged in switches user
   *
   * Required
   * - json body with 'JSON.userId', 'JSON.password' keys
   */
  router.post('/login', mwInject('db', db), postApiLogin)

  /* Required
   * - general/admin login
   */
  router.post('/logout', mwValidateCookiesSession, mwInject('db', db), postApiLogout)

  /* Required
   * - admin login
   * - query with key 'config.query.delay' and a integer string of valid range
   */
  router.put('/delay', mwValidateCookiesSession, mwValidateTransformQueryDelay, mwInject('db', db), putApiDelay)

  router.all('*', (req, res) => { res.status(404).end() });

  return router;
}
