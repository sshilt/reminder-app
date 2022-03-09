import React from 'react'
import axios from 'axios'

const Reminder = ({ reminder }) => {
  return (
    <li>
      [{new Date(reminder.timestamp).toLocaleString()}] {reminder.name}
    </li>
  )
}

const Button = ({ type, text }) => {
  return (
    <button type={type}>{text}</button>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reminders: [],
      newTopic: '',
      newTimeStamp: ''
    }
  }

  componentDidMount() {
    console.log('did mount')
    axios
      .get('http://localhost:3001/reminders')
      .then(response => {
        console.log('promise fulfilled')
        this.setState({ reminders: response.data })
      })
  }

  addReminder = (event) => {
    event.preventDefault()
    if (!this.state.reminders.some(e => e.name === this.state.newTopic) && this.state.newTopic !== '') {
      const reminderObject = {
        name: this.state.newTopic,
        timestamp: this.state.newTimeStamp
      }
      axios
      .post('http://localhost:3001/reminders', reminderObject)
      .then(response => {
        this.setState({
          reminders : this.state.reminders.concat(response.data),
          newTopic: '',
          newTimeStamp: ''
        })
      })
    }
  }

  handleReminderChange = (event) => {
    this.setState({ newTopic: event.target.value })
  }

  handleDateChange = (event) => {
    this.setState({ newTimeStamp: event.target.value })
  }

  render() {
    return (
      <div>
        <h2>Add reminder</h2>
        <form onSubmit={this.addReminder}>
          <div>
            Topic:
            <input
              value={this.state.newTopic}
              onChange={this.handleReminderChange}
            />
          </div>
          <div>
            At time:
            <input
              value={this.state.newTimeStamp}
              onChange={this.handleDateChange}
            />
          </div>
          <div>
            <Button type='submit' text='Add' />
          </div>
        </form>
        preview: [{new Date(this.state.newTimeStamp).toLocaleString()}] {this.state.newTopic}
        <h2>Reminders</h2>
        <ul>
          {this.state.reminders.map(reminder => <Reminder key={reminder.name} reminder={reminder} />)}
        </ul>
      </div>
    )
  }
}

export default App