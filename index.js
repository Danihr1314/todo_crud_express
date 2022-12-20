const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { json } = require('express');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./files/tasks.json');

app.get('/users', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  res.send(jsonFile);
});

app.post('/users', async (req, res) => {
  const newTask = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({ ...newTask, id: newId });
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

app.put('/users', async (req, res) => {
  const taskUpdated = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  for (let i = 0; i < tasksArray.length; i++) {
    if (taskUpdated.id === tasksArray[i].id) {
      tasksArray.splice(i, 1, taskUpdated);
      await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    }
  }
  res.end();
});

app.delete('/users', async (req, res) => {
  const taskDeleted = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  for (let i=0; i<tasksArray.length;i++){
    if(taskDeleted.id === tasksArray[i].id){
      tasksArray.splice(i,1);
      await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    }
  }
  res.end();
})

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor con puerto ${PORT}`);
})