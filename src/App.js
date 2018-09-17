import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AuthService from './services'

import Register from './pages/Register'
import PublicPage from './pages/publicpage'
import Landing from './pages/landing'
import Private from './pages/private'

class App extends Component {
	render() {
		let auth=new AuthService()
		return (
			<div>
				<Router>
				<Switch>
					{(auth.loggedIn())?
							<Route path="/private" component={Private}/>
						:
							<Redirect from="/private" to="/register" />
					}
						<Route path="/register" component={Register} />
						<Route path="/public" component={PublicPage} />
						<Route path="/" component={Landing} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
