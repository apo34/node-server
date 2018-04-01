import * as expect from 'expect';
import { ObjectID } from 'mongodb';
import * as request from 'supertest';
import { app } from './../index';
import { Todo } from './../models';

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Third test todo'
  }
];

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(testTodos))
    .then(() => done());
});

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
      .send({ })
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
