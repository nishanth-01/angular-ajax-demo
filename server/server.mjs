import http from 'node:http';
import express from 'express';
import parseurl from 'parseurl';
import cookieParser from 'cookie-parser';
import vhost from 'vhost';

import * as config from '../config.mjs'
import routerApi from './routerApi.mjs';
import DataBase from './database.mjs';

const BASE_PATH_HOME = '/';

// options should remain same for the cookies to work properly
// set 'maxAge' to undegined for session cookies
const cookies = {
  userId: {
    key: 'user_id',
    options: {
      maxAge: undefined,
      httpOnly: true,
    },
  },
  sessionId: {
    key: 'session_id',
    options: {
      maxAge: undefined,
      httpOnly: true,
    },
  },
};

function main() {
  const app = express();
  const db = new DataBase();

  // TODO: close db
  db.init();

  // common middlewares
  app.use(express.json());
  app.use(cookieParser());

  if(process.env.NODE_ENV === 'development') {
    // logging
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.hostname}${req.path}`);
      console.log(req.cookies);
      console.log(req.body);
      next();
    });
  }

  app.use('/api', routerApi(express, db));

  app.use(express.static(config.STATIC_ROOT, {
    fallthrought: false,
    dotfiles: 'deny',
  }));

  app.all('*', (req, res) => { res.redirect(303, BASE_PATH_HOME) });

  const server = http.createServer(app);
  server.listen(config.PORT, config.DOMAIN, () => {
    const addr = server.address();
    console.log(`server started at ${addr.address}:${addr.port}`);
  });
}

main();
