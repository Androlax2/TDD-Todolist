const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

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

/**
 * Remove and close the database.
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});

describe('Task Model Test', () => {

    it('create & save a task successfully', async () => {
        const validTask = new Task({
            name: 'Le nom de ma première tâche'
        });
        const savedTask = await validTask.save();

        expect(savedTask.name).toBeDefined();
        expect(savedTask.status).toBeDefined();
        expect(savedTask.created_at).toBeDefined();
    });

    it('should not create a task if the name isn\'t filled', async () => {
        const requiredNameTask = new Task({});

        let err;

        try {
            const savedTaskWithoutRequiredName = await requiredNameTask.save();
            err = savedTaskWithoutRequiredName;
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });

    it('should create a task with the today date', async () => {
        const validTask = new Task({
            name: 'Le nom de ma première tâche'
        });
        const now = new Date(Date.now());
        const savedTask = await validTask.save();

        expect(savedTask.name).toBeDefined();
        expect(savedTask.status).toBeDefined();
        expect(savedTask.created_at).toEqual(now);
    });

    it('should create a task with by default pending as status', async () => {
        const validTask = new Task({
            name: 'Le nom de ma première tâche'
        });
        const savedTask = await validTask.save();

        expect(savedTask.name).toBeDefined();
        expect(JSON.stringify(savedTask.status)).toEqual(JSON.stringify(['pending']));
        expect(savedTask.created_at).toBeDefined()
    });

    it('should not be possible to create a task with anything than pending, ongoing or completed as status', async () => {
        const statusIsNotValidTask = new Task({
            name: 'Le nom de ma première tâche',
            status: 'Ce statut n\'est pas valide'
        });

        let err;

        try {
            const savedTaskWithoutValidStatus = await statusIsNotValidTask.save();
            err = savedTaskWithoutValidStatus;
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should create a task with the informations we filled in', async () => {
        const createdAt = new Date(new Date().getMonth() + 1);
        const validTask = new Task({
            name: 'Le nom de ma première tâche',
            status: 'ongoing',
            created_at: createdAt
        });
        const savedTask = await validTask.save();

        expect(savedTask.name).toBe('Le nom de ma première tâche');
        expect(JSON.stringify(savedTask.status)).toEqual(JSON.stringify(['ongoing']));
        expect(savedTask.created_at).toEqual(createdAt);
    });

});