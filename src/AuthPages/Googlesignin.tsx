

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

// Firebase Configuration - replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyBJV8GA1ucg9US-LpOzlZAXsrlOTjPomhI",
    authDomain: "profiler-backend-ab927.firebaseapp.com",
    projectId: "profiler-backend-ab927",
    storageBucket: "profiler-backend-ab927.firebasestorage.app",
    messagingSenderId: "703853702827",
    appId: "1:703853702827:web:31472ed2c7580f2daed1ee",
    measurementId: "G-12LH4VMZ57",    
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const GoogleSignIn: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('Not signed in');
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setStatus(`Logged in as ${currentUser.displayName}`);
      } else {
        setUser(null);
        setStatus('Not signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("User... ", result, user, idToken);

      const response = await fetch(
        "http://localhost:3005/api/auth/signin/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        setStatus(`Logged in as ${user.displayName}`);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setStatus("Error signing in");
    }
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (token) {
        await fetch("http://localhost:3005/api/auth/signout/google", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      
      await signOut(auth);
      localStorage.removeItem("jwtToken");
      setStatus("Signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      setStatus("Error signing out");
    }
  };

  return (
    <div>
      <h2>Google Sign-In</h2>
      <button 
        id="googleSignInBtn" 
        className="google-btn" 
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
      <button 
        id="googleSignOutBtn" 
        className="google-btn" 
        onClick={handleSignOut}
      >
        Sign Out
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default GoogleSignIn;