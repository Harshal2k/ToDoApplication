const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());

// MongoDB Atlas connection string
const uri = 'mongodb://mongo:27017/todo_db';

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error(error));

// Create a schema and model for tasks
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdOn: Date,
    status: String
});

const Task = mongoose.model('Task', taskSchema);

//modes => wait dev test done
app.post('/api/createTasks', (req, res) => {
    const body = req?.body;
    const task = new Task({
        title: body?.title,
        description: body?.description,
        createdOn: body?.createdOn,
        status: 'wait'
    });
    task.save()
        .then((resu) => {
            console.log({ resu });
            res.status(200).send(resu);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error saving task to database');
        });
});

app.patch('/api/editTask/:taskId', (req, res) => {
    const { taskId } = req.params;
    const body = req?.body;
    Task.findByIdAndUpdate(
        taskId,
        {
            title: body?.title,
            description: body?.description,
            status: body?.status
        },
        { new: true }
    ).then(() => {
        res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error saving task to database');
    });
});

app.delete('/api/deleteTask/:taskId', (req, res) => {
    const { taskId } = req?.params;
    Task.findByIdAndDelete(taskId)
        .then(() => {
            res.status(200).send("success");
        }).catch((err) => {
            res.status(500).send('Error deleting task from database');
        });
});

app.get('/api/getTasks', (req, res) => {
    Task.find({})
        .then((tasks) => {
            const toReturn = {
                wait: [],
                dev: [],
                test: [],
                done: []
            }
            tasks?.forEach((task) => {
                switch (task?.status) {
                    case 'wait':
                        toReturn?.wait?.push(task);
                        break;
                    case 'dev':
                        toReturn?.dev?.push(task);
                        break;
                    case 'test':
                        toReturn?.test?.push(task);
                        break;
                    case 'done':
                        toReturn?.done?.push(task);
                        break;
                    default:
                        break;
                }
            });
            res.status(200).send(toReturn);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error retrieving tasks from database');
        });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
