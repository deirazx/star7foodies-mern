import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBhh08-fqFDkKk41PiS3WFA0z_9iC5yPbE",
    authDomain: "star7foodies-7a5ad.firebaseapp.com",
    projectId: "star7foodies-7a5ad",
    storageBucket: "star7foodies-7a5ad.firebasestorage.app",
    messagingSenderId: "1033754839905",
    appId: "1:1033754839905:web:53113bacfa695b7859d320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }