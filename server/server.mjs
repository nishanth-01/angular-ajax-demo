import http from 'node:http';
import express from 'express';
import parseurl from 'parseurl';
import cookieParser from 'cookie-parser';
import vhost from 'vhost';

import * as config from '../config.mjs'
import routerApi from './routerApi.mjs';
import DataBase from './database.mjs';

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

function main() {
  const app = express();
  const db = new DataBase();

  // TODO: close db
  db.init();

  // common middlewares
  app.use(express.json());
  app.use(cookieParser());

  // sub domains
  app.use(vhost(config.API_DOMAIN, routerApi(express, db)));

  app.use(express.static(config.STATIC_ROOT, {
    fallthrought: false,
    dotfiles: 'deny',
  }));

  app.all('*', (req, res) => { res.status(404).end('main') });

  const server = http.createServer(app);
  server.listen(config.PORT, config.DOMAIN, () => {
    const addr = server.address();
    console.log(`server started at ${addr.address}:${addr.port}`);
  });
}
