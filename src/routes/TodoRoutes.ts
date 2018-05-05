import express from 'express';
import pick from 'lodash/pick';
import { ObjectId } from 'mongodb';
import { Todo } from './../models';

export class TodoRoutes {

  constructor (app: express.Express) {
    app.route('/todos')
      .get((req, res) => {
        Todo.find()
          .then((todos) => {
            res.send({ todos });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }).post((req, res) => {
        const todo = new Todo({
          text: req.body.text
        });

        todo.save()
          .then((doc) => {
            res.send(doc);
          })
          .catch(() => {
            res.status(400).send();
          });
      });

    app.route('/todos/:id')
      .get((req, res) => {
        if (!this._validateId(req, res)) {
          return;
        } else {
          Todo.findById(req.params.id)
            .then((todo) => {
              if (!todo) {
                res.status(404).send();
              } else {
                res.send({ todo });
              }
            })
            .catch(() => {
              res.status(500).send();
            });
        }
      })
      .delete((req, res) => {
        if (!this._validateId(req, res)) {
          return;
        } else {
          Todo.findByIdAndRemove(req.params.id)
            .then((todo) => {
              if (!todo) {
                res.status(404).send();
              } else {
                res.send({ todo });
              }
            })
            .catch(() => {
              res.status(500).send();
            });
        }
      }).patch((req, res) => {
        const body = pick(req.body, ['text', 'completed']);
        if (!this._validateId(req, res)) {
          return;
        } else {

          if (body.completed === true) {
            body.completedAt = new Date().getTime();
          } else {
            body.completed = false;
            body.completedAt = null;
          }

          Todo.findByIdAndUpdate(req.params.id, {
            $set: body
          }, {
            new: true
          })
            .then((todo) => {
              if (!todo) {
                res.status(404).send();
              } else {
                res.send({ todo });
              }
            })
            .catch(() => {
              res.status(500).send();
            });
        }
      });
  }

  private _validateId (request: express.Request, response: express.Response): boolean {
    const givenId = request.params.id;
    if (!ObjectId.isValid(givenId)) {
      response.status(422).send();
      return false;
    }
    return true;
  }

}
