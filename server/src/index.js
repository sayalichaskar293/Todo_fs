const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const cors= require('cors')
const dotenv = require("dotenv")

dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@todo.5fygloc.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(() => console.log('MongoDB connected'))
  // .catch(err => console.log('Error connecting to MongoDB:', err));

const todoCardSchema = new mongoose.Schema({
    id: String,
    taskName: String,
    comment: String,
    date: Date
  });
  

const TodoCard = mongoose.model('TodoCard', todoCardSchema);

const app= express();

app.use(bodyParser.json());
app.use(cors());


app.post('/addtodoCard', async (req, res) => {
  if (!req.body.taskName || !req.body.comment || !req.body.date) {
    return res.json({ error: 'Missing required fields' });
  }

  const todoCard = new TodoCard({
    id: uuidv4(),
    taskName: req.body.taskName,
    comment: req.body.comment,
    date: new Date(req.body.date)
  });

  try {
    await todoCard.save();
    res.status(201).json(todoCard);
  } catch (err) {
    console.log(err);
    res.json({ error: 'Failed to add TodoCard' });
  }
});


app.get('/getAllTodoCards', async (req, res) => {
    try {
      const todoCards = await TodoCard.find().sort({ date: 'desc' });
      res.json(todoCards);
    } catch (err) {
      console.log(err);
      res.json({ error: 'Failed to get TodoCards' });
    }
  });
    

app.listen(3001, ()=>{
    console.log("server has started")
})