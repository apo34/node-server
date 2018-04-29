import * as bodyParser from 'body-parser';
import * as express from 'express';

import { Db } from './db/db';

import { TodoRoutes, UsersRoutes } from './routes';

import * as JWT from 'jsonwebtoken'

export const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const TodoRoutesInstance = new TodoRoutes(app);
const UserRoutesInsctance = new UsersRoutes(app);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
  Db.connect()
    .then(() => {
      console.log(`Connected to db`);
      console.log(``);
      app.emit('appStarted');
    });
});

JWT.sign('s','s')
