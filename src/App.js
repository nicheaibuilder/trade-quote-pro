import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            setUserData({ email: firebaseUser.email });
          }
        });
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setLoading(false);
        return () => unsubscribeFirestore();
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div style={{textAlign:'center', padding:'4rem', fontFamily:'Inter, sans-serif'}}>Loading Application...</div>;
  }

  return (
    <div>
      {user ? <Dashboard user={user} userData={userData} onLogout={handleLogout} /> : <AuthPage />}
    </div>
  );
}

export default App;