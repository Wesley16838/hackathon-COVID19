import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
const config = {
    apiKey: "AIzaSyBZLaJ86GFtjdcAH79eEOpXmKXa-1JEbYg",
    authDomain: "hackathon-covid.firebaseapp.com",
    databaseURL: "https://hackathon-covid.firebaseio.com",
    projectId: "hackathon-covid",
    storageBucket: "hackathon-covid.appspot.com",
    messagingSenderId: "124009300088",
    appId: "1:124009300088:web:406688eac0e2118e22ed8d",
    measurementId: "G-V7PPKWZ90X"
};

class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	addQuote(quote) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
			quote
		})
	}


	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserQuote() {
		const quote = await this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).get()
		return quote.get('quote')
	}
}

export default new Firebase()