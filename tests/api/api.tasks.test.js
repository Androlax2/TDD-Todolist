const app = require('../../server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest('app');

const Task = require('../../models/Task');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    const uri = await mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    };

    await mongoose.connect(uri, mongooseOpts);
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

describe('API TODOLIST', () => {

    // All tests for GET /tasks
    describe('GET /tasks', () => {

        it('should retrieve 3 tasks', async done => {
            const firstTask = new Task({name: 'Ma première tâche'});
            const secondTask = new Task({name: 'Ma seconde tâche'});
            const thirdTask = new Task({name: 'Ma troisième tâche'});
            const savecFirstTask = await firstTask.save();
            const savecSecondTask = await secondTask.save();
            const savecThirdask = await thirdTask.save();

            const res = await request.get('/tasks');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Object.keys(res.body.data).length).toBe(3);

            done();
        });

        // All tests for task retrieved by an ID
        describe('GET /tasks/:taskID', () => {
            // Continuer
        })

    });

    // All tests for POST /tasks (create a task)
    describe('POST /tasks', () => {
        // Continuer
    });

    // All tests for PUT /tasks (update a task)
    describe('PUT /tasks', () => {
        // Continuer
    });

});