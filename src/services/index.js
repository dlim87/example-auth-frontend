import decode from 'jwt-decode'

export default class AuthService {
	constructor(domain) {
		this.domain = domain || 'http://localhost:3000'
		this.fetch = this.fetch.bind(this)
		this.getUserId = this.getUserId.bind(this)
	}

	login = (email, password) => {
		return this.fetch(`${this.domain}/users`, {
			method: "POST",
			body: JSON.stringify(email, password),
		})
		.then(res => {
			this.setToken(res.jti)
			return res
		})
	}

	register = (user) => {
		return this.fetch(`${this.domain}/users`, {
			method: "POST",
			body: JSON.stringify(user),
		})
		.then(res => {
			this.setToken(res.jti)
			return res
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
	setToken(idToken) {
		localStorage.setItem('id_token', idToken)
	}

	// Fetch the token from local storage
	getToken() {
		return localStorage.getItem('id_token')
	}

	// Removes the token
	logout() {
		localStorage.removeItem('id_token');
	}

	getUserId() {
		const token = decode(this.getToken());
		return token.sub
	}

	fetch(url, options) {
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
		.then(response => response.json())
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
