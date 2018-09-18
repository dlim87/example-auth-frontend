import decode from 'jwt-decode'

export default class AuthService {
	constructor(domain) {
		this.domain = domain || 'http://localhost:3000'
	}

	login = (email, password) => {
		console.log("Starting Login Request", email, password);
		return this.authFetch(`${this.domain}/users/sign_in`, {
			method: "POST",
			body: JSON.stringify(email, password),
		})
	}

	register = (user) => {
		console.log(user);
		return this.authFetch(`${this.domain}/users`, {
			method: "POST",
			body: JSON.stringify(user),
		})
	}

	loggedIn() {
		const token = this.getToken()
		return !!token && !this.isTokenExpired(token)
	}

	isTokenExpired(token) {
		try {
			const decoded = decode(token)
			if (decoded.exp < Date.now() / 1000) {
				return true
			} else {
				return false
			}
		}
		catch (err) {
			return false;
		}
	}

	// The token is stored in the browser
	setToken(token) {
		// console.log(token);
		let parsedToken = token.split(' ')[1]
		localStorage.setItem('id_token', parsedToken)
	}

	// Fetch the token from local storage
	getToken() {
		return localStorage.getItem('id_token')
	}

	// Removes the token
	logout() {
		localStorage.removeItem('id_token');
	}

	getUserId = () => {
		const token = decode(this.getToken());
		return token.sub
	}

	authFetch = (url, options) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}

		if (this.loggedIn()) {
			headers['Authorization'] = 'Bearer ' + this.getToken()
		}

		return fetch(url, {
			headers,
			...options
		})
		.then(this._checkStatus)
		.then(res => {
			console.log(res);
			let token = res.headers.get('Authorization')
			console.log(token);
			// set a token, taken out of response from API
			this.setToken(token)
			return res
		})
		.catch(err => {
			console.log("::: FETCH ERROR CAUGHT:::", err)
			return err
		})
	}

	_checkStatus(response) {
		if(response.status >= 200 && response.status < 300) {
			console.log(":::SUCCESS:::");
		} else {
			console.log(":::ERROR:::", response)
		}
		return response
	}
}
