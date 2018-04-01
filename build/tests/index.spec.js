"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expect = require("expect");
var mongodb_1 = require("mongodb");
var request = require("supertest");
var index_1 = require("./../index");
var models_1 = require("./../models");
var testTodos = [
    {
        _id: new mongodb_1.ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new mongodb_1.ObjectID(),
        text: 'Second test todo'
    },
    {
        _id: new mongodb_1.ObjectID(),
        text: 'Third test todo'
    }
];
beforeEach(function (done) {
    models_1.Todo.remove({})
        .then(function () { return models_1.Todo.insertMany(testTodos); })
        .then(function () { return done(); });
});
before(function (done) {
    index_1.app.on('appStarted', function () {
        done();
    });
});
describe('POST /todos', function () {
    it('should create new todo', function (done) {
        var text = 'Text todo text';
        request(index_1.app)
            .post('/todos')
            .send({ text: text })
            .expect(200)
            .expect(function (res) {
            expect(res.body.text).toBe(text);
        }).end(function (err, res) {
            if (err) {
                return done(err);
            }
            models_1.Todo.find()
                .then(function (todos) {
                expect(todos.length).toBe(testTodos.length + 1);
                expect(todos.slice().pop().text).toBe(text);
                done();
            }).catch(function (err) { return done(err); });
        });
    });
    it('should not create with bad data', function (done) {
        request(index_1.app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(function (err, res) {
            if (err) {
                return done(err);
            }
            models_1.Todo.find()
                .then(function (todos) {
                expect(todos.length).toBe(testTodos.length);
                done();
            }).catch(function (err) { return done(err); });
        });
    });
});
describe('GET /todos', function () {
    it('should get all todos', function (done) {
        request(index_1.app)
            .get('/todos')
            .expect(200)
            .expect(function (res) {
            expect(res.body.todos.length).toBe(testTodos.length);
        })
            .end(done);
    });
});
describe('GET /todos/:id', function () {
    it('should return todo doc', function (done) {
        request(index_1.app)
            .get("/todos/" + testTodos[0]._id.toHexString())
            .expect(200)
            .expect(function (res) {
            expect(res.body.todo.text).toBe(testTodos[0].text);
        })
            .end(done);
    });
    it('should return 404 on valid Id and no data', function (done) {
        var randomObjectId = new mongodb_1.ObjectID().toHexString();
        request(index_1.app)
            .get("/todos/" + randomObjectId)
            .expect(404)
            .end(done);
    });
    it('should return 422 on invalid Id', function (done) {
        request(index_1.app)
            .get("/todos/invalidId")
            .expect(422)
            .end(done);
    });
});
//# sourceMappingURL=index.spec.js.map