import * as bodyParser from 'body-parser';
import * as express from 'express';
import { ObjectId } from 'mongodb';

import { Db } from './db/db';
import { Todo, User } from './models';

export const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started on port ${port}`);
  Db.connect()
    .then(() => {
      console.log(`Connected to db`);
      console.log(``);
      app.emit('appStarted');
    });
});

app.route('/todos')
  .get((req, res) => {
    Todo.find()
      .then((todos) => {
        res.send({ todos });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  })
  .post((req, res) => {
    const todo = new Todo({
      text: req.body.text
    });

    todo.save()
      .then((doc) => {
        res.send(doc);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

app.route('/todos/:id')
  .get((req, res) => {
    const givenId = req.params.id;
    if (!ObjectId.isValid(givenId)) {
      res.status(422).send();
    } else {
      Todo.findById(req.params.id)
      .then((todo) => {
        if (!todo) {
          res.status(404).send();
        } else {
          res.send({ todo });
        }
      })
      .catch((err) => {
        res.status(500).send();
      });
    }
  });
