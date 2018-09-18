import React, {Component} from 'react'
// import { Redirect, Link } from 'react-router-dom'

import AuthService from '../services'

class Landing extends Component {
  constructor(props){
    super(props)
    this.auth = new AuthService()
    this.state={
      submitsuccess: false,
      errors: "",
      user:{
        email:"test@example.com",
        password: 123134
      }
    }
  }
  logout=()=>{
    console.log('click!');
    this.auth.logout()
    this.setState({submitsuccess:true})
  }

  onChange = (e) => {
    let { user } = this.state

		user[e.target.name] = e.target.value
    console.log(e.target.name, e.target.value);
		this.setState({ user })
	}

  onSubmit = (e) => {
    console.log('click?');
		e.preventDefault()
	  this.auth.login(this.state)
    .then(res => {
      this.setState({
        submitsuccess:true
      })
    })
	}

  render(){
    let {email, password} = this.state.user
    console.log(this.auth.loggedIn());
    let area
      if(this.auth.loggedIn()){
        area= <button onClick={this.logout}> log out</button>
      }
      else{
        area= <form onSubmit={this.onSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.onChange}
          />
          {this.state.errors.email && <div>Error: Email  {this.state.errors.email[0]}</div>}
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
          />
          {this.state.errors.password && <div>Error: Password  {this.state.errors.password[0]}</div>}
          <button>Log in</button>
        </form>
      }

      console.log(this.auth.getToken())
    return(
      <div>
        {area}
      </div>
    )
  }
}
export default Landing

// console.log(this.auth.loggedIn())
// {this.auth.loggedIn() && <Redirect to="/" />}
// {this.state.loggedoutsuccess&&<Redirect to="/" />}
