import express from 'express';
import pick from 'lodash/pick';
import { authenticate, IAthenticatedRequest } from './../middleware';
import { User } from './../models';

export class UsersRoutes {

  constructor (app: express.Express) {
    app.route('/users')
      .post((req, res) => {
        const body = pick(req.body, ['email', 'password']);
        const user = new User(body);

        user.save()
          .then(() =>
            user.generateAuthToken()
          )
          .then((token) =>
            res.header('x-auth', token).send(user)
          )
          .catch((err) => {
            res.status(400).send();
          });
      });

    app.route('/users/me')
      .get(authenticate, (req: IAthenticatedRequest, res) => {
        res.send(req.user);
      });

  }
}
