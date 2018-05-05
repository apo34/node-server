import expect from 'expect';
import { ObjectID } from 'mongodb';
import request from 'supertest';
import { app } from './../index';
import { Todo, User } from './../models';
import { populateTodos, populateUsers, testTodos, testUsers } from './seed/seed';

beforeEach(populateTodos);
beforeEach(populateUsers);

before((done) => {
  app.on('appStarted', () => {
    done();
  });
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    const text = 'Text todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(testTodos.length + 1);
            expect([...todos].pop().text).toBe(text);
            done();
          }).catch((err) => done(err));
      });
  });

  it('should not create with bad data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(testTodos.length);
            done();
          }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(testTodos.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 on valid Id and no data', (done) => {
    const randomObjectId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${randomObjectId}`)
      .expect(404)
      .end(done);
  });

  it('should return 422 on invalid Id', (done) => {
    request(app)
      .get(`/todos/invalidId`)
      .expect(422)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo', (done) => {
    const deletedId = testTodos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${deletedId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(deletedId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(deletedId)
          .then((res) => {
            expect(res).toBeNull();
            done();
          }).catch((err) => done(err));
      });
  });

  it('should return 404 on valid Id and no data', (done) => {
    const randomObjectId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${randomObjectId}`)
      .expect(404)
      .end(done);
  });

  it('should return 422 on invalid Id', (done) => {
    request(app)
      .delete(`/todos/invalidId`)
      .expect(422)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should return updated todo doc', (done) => {
    const text = 'Modified text';

    request(app)
      .patch(`/todos/${testTodos[0]._id.toHexString()}`)
      .send({ text, completed: true })
      .expect(200)
      .expect((res) => {
        const todo = res.body.todo;
        expect(todo.text).toBe(text);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).not.toBeNull();
      })
      .end(done);
  });

  it('should clear completedAt updated todo doc', (done) => {

    request(app)
      .patch(`/todos/${testTodos[0]._id.toHexString()}`)
      .send({ completed: false })
      .expect(200)
      .expect((res) => {
        const todo = res.body.todo;
        expect(todo.completed).toBe(false);
        expect(todo.completedAt).toBeNull();
      })
      .end(done);
  });

  it('should return 404 on valid Id and no data', (done) => {
    const randomObjectId = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${randomObjectId}`)
      .expect(404)
      .end(done);
  });

  it('should return 422 on invalid Id', (done) => {
    request(app)
      .patch(`/todos/invalidId`)
      .expect(422)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(testUsers[0]._id.toHexString());
        expect(res.body.email).toBe(testUsers[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'unique@email.com';
    const password = '123456!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch((err) => done(err));

      });
  });

  it('should return validation errors', (done) => {
    const email = 'notAnEmail';
    const password = 'pass';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
        expect(res.body).toEqual({});
      })
      .end(done);
  });

  it('should not create user when email in use', (done) => {
    const email = testUsers[0].email;
    const password = 'password';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should allow login with correct credentials', (done) => {
    const email = testUsers[1].email;
    const password = testUsers[1].password;
    const id = testUsers[1]._id;

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(id)
          .then((user) => {
            expect(user).toBeTruthy();
            expect(user.tokens[0]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should return 403 on wrong credentials', (done) => {
    const email = testUsers[0].email;
    const password = 'randomPassword';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(403)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end(done);
  });

  it('should return 404 on non existing user', (done) => {
    const email = 'notExistingEmail@example.com';
    const password = 'randomPassword';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(404)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end(done);
  });
});
