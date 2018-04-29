import * as express from 'express';
import * as pick from 'lodash/pick';
import { ObjectId } from 'mongodb';
import { User } from './../models';

export class UsersRoutes {

  constructor (app: express.Express) {
    console.log('UserRoutes constructor');
    app.route('/users')
      .post((req, res) => {
        const body = pick(req.body, ['email', 'password']);
        const user = new User(body);
        console.log('users post');

        user.save()
          .then((userModel) => {
            console.log(userModel);
            return userModel.generateAuthToken();
            // res.send(user);
          })
          .then(token)
          .catch(() => {
            console.log('err?');
            res.status(400).send();
          });
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
