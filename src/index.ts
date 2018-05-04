import * as bodyParser from 'body-parser';
import * as express from 'express';

import { Db } from './db/db';

import { config } from './config';
import { TodoRoutes, UsersRoutes } from './routes';

export const app = express();

const port = process.env.PORT || config.defaultPort;

app.use(bodyParser.json());

const TodoRoutesInstance = new TodoRoutes(app);
const UserRoutesInstance = new UsersRoutes(app);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
  Db.connect()
    .then((status) => {
      if (status) {
        console.log(`Connected to db`);
        console.log(``);
        app.emit('appStarted');
      } else {
        console.log('App terminating...');
        process.exit(1);
      }
    });
});
