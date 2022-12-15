import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAnlbwVYo_GswUhZ2fgGySSiN0d8W2bys",
    authDomain: "kabeer-chats.firebaseapp.com",
    projectId: "kabeer-chats",
    storageBucket: "kabeer-chats.appspot.com",
    messagingSenderId: "1092731470820",
    appId: "1:1092731470820:web:1bab7007e4ebbc2d227df1",
    measurementId: "G-H89SHVYL91"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
console.log("kn.chats.env: ", process.env.NODE_ENV);
if ((process.env.NODE_ENV === 'development') && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR) {
    console.log('Using Emulator: ', process.env.NEXT_PUBLIC_EMULATOR_ADDRESS.split(':')[0], process.env.NEXT_PUBLIC_EMULATOR_ADDRESS.split(':')[1])
    db.useEmulator(process.env.NEXT_PUBLIC_EMULATOR_ADDRESS.split(':')[0], process.env.NEXT_PUBLIC_EMULATOR_ADDRESS.split(':')[1]);
}
db.settings({cacheSizeBytes: 5e+7, merge: true});
const auth = app.auth();

const analytics = firebase.analytics;
const provider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

export {db, auth, provider, analytics, githubProvider, facebookProvider};
