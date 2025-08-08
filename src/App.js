import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// We will create these component files next
// import AuthPage from './components/AuthPage'; 
// import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.data() // Spread the rest of the user's data
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading Application...</div>;
  }

  // For now, let's just show a simple placeholder for the components
  // In a real app, you would import and render your components here
  return (
    <div>
      <h1>TradeQuote Pro</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <p>Your UID is: {user.uid}</p>
          {/* <Dashboard user={user} /> */}
        </div>
      ) : (
        <div>
          <p>Please log in.</p>
          {/* <AuthPage /> */}
        </div>
      )}
    </div>
  );
}

export default App;