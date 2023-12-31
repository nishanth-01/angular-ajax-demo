import http from 'node:http';
import express from 'express';
import parseurl from 'parseurl';
import cookieParser from 'cookie-parser';
import open from 'open';

import config from '../config.json' with { type: "json" };
import routerApi from './api.router.mjs';
import DataBase from './database.mjs';


(function () {
  const STATIC_FILES_ROOT = '../static';
/*
  if(!STATIC_FILES_ROOT) {
    const scriptName = process.argv[1].match(/[^\/]*$/)[0];
    console.error(`invalid arguments`);
    console.error(`usage: node ${scriptName} [path to static fles]`);
    process.exit(1);
  }
  console.log(STATIC_FILES_ROOT);//debug
*/
  const app = express();
  const db = new DataBase();

  // TODO: close db
  db.init();

  // common middlewares
  app.use(express.json());
  // options should remain same for the cookies to work properly
  app.use(cookieParser());

  if(process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.hostname}${req.path}`);
      console.log(req.cookies);
      console.log(req.body);
      next();
    });
  }

  app.use('/api', routerApi(express, db));

  app.use(express.static(STATIC_FILES_ROOT, {
    dotfiles: 'deny',
  }));

  app.get('*', (req, res) => { res.redirect(303, config.BASE_PATH_HOME) });

  const server = http.createServer(app);
  server.listen(config.PORT, config.DOMAIN, () => {
    const addr = server.address();
    console.log(`server started at ${addr.address}:${addr.port}`);

    open(`${config.PROTOCOL}://${addr.address}:${addr.port}`)
      .catch(() => {
        console.log('error: unable to open browser, open url manually');
      });
  });
})();
