"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var expect_1 = __importDefault(require("expect"));
var mongodb_1 = require("mongodb");
var supertest_1 = __importDefault(require("supertest"));
var index_1 = require("./../index");
var models_1 = require("./../models");
var seed_1 = require("./seed/seed");
beforeEach(seed_1.populateTodos);
beforeEach(seed_1.populateUsers);
before(function (done) {
    index_1.app.on('appStarted', function () {
        done();
    });
});
describe('POST /todos', function () {
    it('should create new todo', function (done) {
        var text = 'Text todo text';
        supertest_1.default(index_1.app)
            .post('/todos')
            .send({ text: text })
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.body.text).toBe(text);
        }).end(function (err, res) {
            if (err) {
                return done(err);
            }
            models_1.Todo.find()
                .then(function (todos) {
                expect_1.default(todos.length).toBe(seed_1.testTodos.length + 1);
                expect_1.default(todos.slice().pop().text).toBe(text);
                done();
            }).catch(function (err) { return done(err); });
        });
    });
    it('should not create with bad data', function (done) {
        supertest_1.default(index_1.app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(function (err, res) {
            if (err) {
                return done(err);
            }
            models_1.Todo.find()
                .then(function (todos) {
                expect_1.default(todos.length).toBe(seed_1.testTodos.length);
                done();
            }).catch(function (err) { return done(err); });
        });
    });
});
describe('GET /todos', function () {
    it('should get all todos', function (done) {
        supertest_1.default(index_1.app)
            .get('/todos')
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.body.todos.length).toBe(seed_1.testTodos.length);
        })
            .end(done);
    });
});
describe('GET /todos/:id', function () {
    it('should return todo doc', function (done) {
        supertest_1.default(index_1.app)
            .get("/todos/" + seed_1.testTodos[0]._id.toHexString())
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.body.todo.text).toBe(seed_1.testTodos[0].text);
        })
            .end(done);
    });
    it('should return 404 on valid Id and no data', function (done) {
        var randomObjectId = new mongodb_1.ObjectID().toHexString();
        supertest_1.default(index_1.app)
            .get("/todos/" + randomObjectId)
            .expect(404)
            .end(done);
    });
    it('should return 422 on invalid Id', function (done) {
        supertest_1.default(index_1.app)
            .get("/todos/invalidId")
            .expect(422)
            .end(done);
    });
});
describe('DELETE /todos/:id', function () {
    it('should remove todo', function (done) {
        var deletedId = seed_1.testTodos[0]._id.toHexString();
        supertest_1.default(index_1.app)
            .delete("/todos/" + deletedId)
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.body.todo._id).toBe(deletedId);
        })
            .end(function (err, res) {
            if (err) {
                return done(err);
            }
            models_1.Todo.findById(deletedId)
                .then(function (res) {
                expect_1.default(res).toBeNull();
                done();
            }).catch(function (err) { return done(err); });
        });
    });
    it('should return 404 on valid Id and no data', function (done) {
        var randomObjectId = new mongodb_1.ObjectID().toHexString();
        supertest_1.default(index_1.app)
            .delete("/todos/" + randomObjectId)
            .expect(404)
            .end(done);
    });
    it('should return 422 on invalid Id', function (done) {
        supertest_1.default(index_1.app)
            .delete("/todos/invalidId")
            .expect(422)
            .end(done);
    });
});
describe('PATCH /todos/:id', function () {
    it('should return updated todo doc', function (done) {
        var text = 'Modified text';
        supertest_1.default(index_1.app)
            .patch("/todos/" + seed_1.testTodos[0]._id.toHexString())
            .send({ text: text, completed: true })
            .expect(200)
            .expect(function (res) {
            var todo = res.body.todo;
            expect_1.default(todo.text).toBe(text);
            expect_1.default(todo.completed).toBe(true);
            expect_1.default(todo.completedAt).not.toBeNull();
        })
            .end(done);
    });
    it('should clear completedAt updated todo doc', function (done) {
        supertest_1.default(index_1.app)
            .patch("/todos/" + seed_1.testTodos[0]._id.toHexString())
            .send({ completed: false })
            .expect(200)
            .expect(function (res) {
            var todo = res.body.todo;
            expect_1.default(todo.completed).toBe(false);
            expect_1.default(todo.completedAt).toBeNull();
        })
            .end(done);
    });
    it('should return 404 on valid Id and no data', function (done) {
        var randomObjectId = new mongodb_1.ObjectID().toHexString();
        supertest_1.default(index_1.app)
            .patch("/todos/" + randomObjectId)
            .expect(404)
            .end(done);
    });
    it('should return 422 on invalid Id', function (done) {
        supertest_1.default(index_1.app)
            .patch("/todos/invalidId")
            .expect(422)
            .end(done);
    });
});
describe('GET /users/me', function () {
    it('should return user if authenticated', function (done) {
        supertest_1.default(index_1.app)
            .get('/users/me')
            .set('x-auth', seed_1.testUsers[0].tokens[0].token)
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.body._id).toBe(seed_1.testUsers[0]._id.toHexString());
            expect_1.default(res.body.email).toBe(seed_1.testUsers[0].email);
        })
            .end(done);
    });
    it('should return 401 if not authenticated', function (done) {
        supertest_1.default(index_1.app)
            .get('/users/me')
            .expect(401)
            .expect(function (res) {
            expect_1.default(res.body).toEqual({});
        })
            .end(done);
    });
});
describe('POST /users', function () {
    it('should create a user', function (done) {
        var email = 'unique@email.com';
        var password = '123456!';
        supertest_1.default(index_1.app)
            .post('/users')
            .send({ email: email, password: password })
            .expect(200)
            .expect(function (res) {
            expect_1.default(res.headers['x-auth']).toBeTruthy();
            expect_1.default(res.body._id).toBeTruthy();
            expect_1.default(res.body.email).toBe(email);
        })
            .end(function (err) {
            if (err) {
                return done(err);
            }
            models_1.User.findOne({ email: email })
                .then(function (user) {
                expect_1.default(user).toBeTruthy();
                expect_1.default(user.password).not.toBe(password);
                done();
            });
        });
    });
    it('should return validation errors', function (done) {
        var email = 'notAnEmail';
        var password = 'pass';
        supertest_1.default(index_1.app)
            .post('/users')
            .send({ email: email, password: password })
            .expect(400)
            .expect(function (res) {
            expect_1.default(res.headers['x-auth']).not.toBeTruthy();
            expect_1.default(res.body).toEqual({});
        })
            .end(done);
    });
    it('should not create user when email in use', function (done) {
        var email = seed_1.testUsers[0].email;
        var password = 'password';
        supertest_1.default(index_1.app)
            .post('/users')
            .send({ email: email, password: password })
            .expect(400)
            .expect(function (res) {
            expect_1.default(res.headers['x-auth']).not.toBeTruthy();
            expect_1.default(res.body).toEqual({});
        })
            .end(done);
    });
});
//# sourceMappingURL=index.spec.js.map