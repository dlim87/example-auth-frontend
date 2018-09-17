import React, {Component} from 'react'
import { Redirect, Link } from 'react-router-dom'

import AuthService from '../services'

class Landing extends Component {
  constructor(props){
    super(props)
    this.auth = new AuthService()
    this.state={
      loggedoutsuccess: false,
      formsubmittry:false,
      formsubmitsuccess: false,
      errors: "",
      form:{
        email:"test@example.com",
        password: 123134
      }
    }
  }
  logout(){
    console.log('click!');
    this.auth.logout()
    this.setState({loggedoutsuccess:true})
  }onChange = (e) => {
    let { form } = this.state

		form[e.target.name] = e.target.value

		this.setState({ form })
	}
  onSubmit = (e) => {
    console.log('click?');
		e.preventDefault()
		console.log(JSON.stringify(this.state.form));
		this.auth.login(this.state.form.email,this.state.form.password)
		.then(json => {
			console.log("Got to second then:", json)
			if(json.errors) {
				this.setState({
					errors: json.errors
				})
			}
			this.setState({
				registerSuccess: true
			})
		})
	}

  render(){
    console.log(this.auth.loggedIn())
    console.log(this.auth.getToken())
    console.log(this.state.loggedoutsuccess);
    console.log(this.state.form);
    let area
    if(this.auth.loggedIn()){
      area= <button onClick={this.logout.bind(this)}> log out</button>
    }
    else{
      area= ""
    }
    return(
      <div>
        <p>{this.auth.loggedIn()?"logged in":"logged out"}</p>

        <form onSubmit={this.login}>
        <input
          type="email"
          name="email"
          value={this.state.form.email}
          onChange={this.onChange}
        />
        {this.state.errors.email && <div>Error: Email  {this.state.errors.email[0]}</div>}
        <input
          type="password"
          name="password"
          value={this.state.form.password}
          onChange={this.onChange}
        />
        {this.state.errors.password && <div>Error: Password  {this.state.errors.password[0]}</div>}
        <button onSubmit={this.onSubmit}>Register</button>
      </form>

      </div>
    )
  }
}
export default Landing

// {this.state.formsubmitsuccess && <Redirect to="/" />}
// {area}
// {this.state.loggedoutsuccess&&<Redirect to="/" />}
