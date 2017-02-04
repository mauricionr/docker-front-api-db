import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Paper, Tab, Tabs, TextField, List, ListItem, RaisedButton } from 'material-ui'
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';

const textFieldStyle = { width: '100%' }
const tabStyle = { width: '90%' }
const API = process.env.API_HOST || 'http://localhost:5000/api'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userEmail: '',
      userLogin: '',
      userPassword: '',
      response: { user: { info: {} } },
      users: [],
      show: false,
      message: ''
    }
  }
  login() {
    let {userLogin, userPassword} = this.state

    axios
      .post(`${API}/auth/login`, { username: userLogin, password: userPassword })
      .then(response => this.setState({ response: Object.assign({}, response.data, this.state), show: true }))
      .then(() => this.users())
      .catch(this.setMessage.bind(this))
  }
  auth() {
    let {userName, userPassword, userEmail, response} = this.state
    let newUser = { name: userName, password: userPassword, email: userEmail };
    let config = {}

    if (response.user.id) {
      newUser = Object.assign({}, newUser, { parentID: response.user.id })
      config = Object.assign({}, { Authorization: `Bearer ${response.user.info.token}` })
    }

    axios
      .post(`${API}/auth/singup`, newUser, config)
      .then(response => this.setState({ message: response.data.message }))
      .catch(this.setMessage.bind(this))

    this.setState({ userName: '', userPassword: '', userEmail: '' })
    this.refs.email.input.value = ''
    this.refs.username.input.value = ''
    this.refs.passwordSignup.input.value = ''
  }
  users() {
    this.clearMessage()

    axios
      .get(`${API}/users?parentid=${this.state.response.user.id}`, { headers: { Authorization: `Bearer ${this.state.response.user.info.token}` } })
      .then(response => this.setState({ users: response.data }))
      .catch(this.setMessage.bind(this))
  }
  setMessage(reason) {
    this.setState({ message: reason.response ? reason.response.data ? reason.response.data.message : reason.message : reason.message })
  }
  delete(item) {
    axios
      .delete(`${API}/users?id=${item.id}`, { headers: { Authorization: `Bearer ${this.state.response.user.info.token}` } })
      .then(this.users.bind(this))
      .catch(this.setMessage.bind(this))
  }
  clearMessage() {
    this.setMessage({ message: '' })
  }
  render() {
    let { show, users, message } = this.state
    return (
      <MuiThemeProvider>
        <Tabs>
          {
            !show ?
              <Tab label="Login" onActive={this.clearMessage.bind(this)} tabTemplateStyle={tabStyle}>
                <TextField id="loginname" ref="loginname" onChange={(event) => this.setState({ userLogin: event.target.value })} hintText="Username or Email" style={textFieldStyle} name="loginname" type="text"></TextField>
                <TextField id="passwordLogin" ref="passwordLogin" onChange={(event) => this.setState({ userPassword: event.target.value })} style={textFieldStyle} hintText="Password" name="passwordLogin" type="password"></TextField>
                <RaisedButton onClick={this.login.bind(this)}>Login</RaisedButton>
                {message ? <p>{message}</p> : ''}
              </Tab>
              : ''
          }
          {
            !show ?
              <Tab label="Signup" onActive={this.clearMessage.bind(this)}>
                <TextField id="username" ref="username" onChange={(event) => this.setState({ userName: event.target.value })} hintText="Username" style={textFieldStyle} name="username" type="text"></TextField>
                <TextField id="email" ref="email" onChange={(event) => this.setState({ userEmail: event.target.value })} hintText="Email" style={textFieldStyle} name="useremail" type="text"></TextField>
                <TextField id="passwordSignup" ref="passwordSignup" onChange={(event) => this.setState({ userPassword: event.target.value })} hintText="Password" style={textFieldStyle} name="passwordSignup" type="password"></TextField>
                <RaisedButton onClick={this.auth.bind(this)}>Signup</RaisedButton>
                {message ? <p>{message}</p> : ''}
              </Tab>
              : ''
          }
          {
            show ?
              <Tab label="All Users" onActive={this.users.bind(this)}>
                <List>
                  {
                    users.map((current, index) => {
                      return <ListItem key={index} rightIcon={<Delete onClick={this.delete.bind(this, current)} />}>{current.info.name}</ListItem>
                    })
                  }
                </List>
                {message ? <p>{message}</p> : ''}
              </Tab>
              : ''
          }
          {
            show ?
              <Tab label="New user" onActive={this.clearMessage.bind(this)}>
                <TextField id="username" ref="username" onChange={(event) => this.setState({ userName: event.target.value })} hintText="Username" style={textFieldStyle} name="username" type="text"></TextField>
                <TextField id="email" ref="email" onChange={(event) => this.setState({ userEmail: event.target.value })} hintText="Email" style={textFieldStyle} name="useremail" type="text"></TextField>
                <TextField id="passwordSignup" ref="passwordSignup" onChange={(event) => this.setState({ userPassword: event.target.value })} hintText="Password" style={textFieldStyle} name="passwordSignup" type="password"></TextField>
                <RaisedButton onClick={this.auth.bind(this)}>Create</RaisedButton>
                {message ? <p>{message}</p> : ''}
              </Tab>
              : ''
          }
        </Tabs>
      </MuiThemeProvider>
    );
  }
}

export default App;
