import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

// const os = require("os");
// const hostExists = require('http').request({
//         host: 'localhost', port: 4001,
//         path: '/', method: 'GET'
//     },  (res) => {
//         console.log("Connected");
//         res.on('data', function (data) {
//             console.log(data);
//         });
//     });
//
// hostExists.end();
// const currentAddress = [...(os.networkInterfaces()['en0'])].find(({family}) => family.toLowerCase() === 'ipv4')['address'];
// console.log(currentAddress);
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
// TODO Emulator config
console.log("env: ", (process.env.CHATS_NODE_ENV ?? process.env.NEXT_RUNTIME["CHATS_NODE_ENV"]));
// if ((process.env.CHATS_NODE_ENV ?? process.env.NEXT_RUNTIME?.CHATS_NODE_ENV) === "development") db.useEmulator("192.168.40.50", 4001);

// db.useEmulator(process.env.SELF_HOST_ADDRESS, 4001);
db.settings({cacheSizeBytes: 5e+7, merge: true});
const auth = app.auth();

// const messaging = {}//app.messaging();
// if (typeof window !== 'undefined' && !firebase.apps.length) {
const analytics = firebase.analytics;
// }
const provider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});


export {db, auth, provider, analytics, githubProvider};
