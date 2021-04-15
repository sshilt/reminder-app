const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())

let reminders = [

    {
        "name": "Buy some eggs",
        "timestamp": "2021-11-10T13:00:00.141Z",
        "id": 1
    },
    {
        "name": "Make an omelette",
        "timestamp": "2021-11-11T08:00:00.141Z",
        "id": 2
    },
    {
        "name": "Wash dishes",
        "timestamp": "2021-11-11T09:00:00.000Z",
        "id": 3
    },
    {
        "name": "Buy more eggs",
        "timestamp": "2021-11-11T13:00:00.000Z",
        "id": 4
    }

]

app.get('/api/reminders', (request, response) => {
    response.json(reminders)
})

app.get('/api/reminders/:id', (request, response) => {
    const id = Number(request.params.id)
    const reminder = reminders.find(reminder => reminder.id === id)

    if (reminder) {
        response.json(reminder)
    }
    else {
        response.status(404).end()
    }
})

app.post('/api/reminders', (request, response) => {
    const body = request.body

    if ((body.name || body.timestamp) === undefined) {
        return response.status(400).json({ error: 'missing name or timestamp' })
    }
    if (reminders.some(reminder => reminder.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const reminder = {
        name: body.name,
        timestamp: body.timestamp,
        id: Math.ceil(Math.random() * 10000)
    }
    reminders = reminders.concat(reminder)

    response.json(reminder)
})

app.delete('/api/reminders/:id', (request, response) => {
    const id = Number(request.params.id)
    reminders = reminders.filter(reminder => reminder.id !== id)

    response.status(204).end()
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})