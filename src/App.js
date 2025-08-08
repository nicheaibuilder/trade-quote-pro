import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AuthPage from './components/AuthPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
        } else {
          // If the user doc doesn't exist (e.g., first sign-up), create it
          const newUserProfile = { email: firebaseUser.email, createdAt: new Date() };
          await setDoc(userDocRef, newUserProfile);
          setUser({ uid: firebaseUser.uid, ...newUserProfile });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div>Loading Application...</div>;
  }
  
  // This is a simplified dashboard for a logged-in user
  const Dashboard = ({ user, onLogout }) => (
    <div style={{padding:'2rem'}}>
        <h1>TradeQuote Pro Dashboard</h1>
        <p>Welcome, {user.email}!</p>
        <button onClick={onLogout}>Log Out</button>
        {/* All other components like QuoteEditor, ClientPortal etc. would be rendered here */}
    </div>
  );

  return (
    <div>
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthPage />}
    </div>
  );
}

export default App;