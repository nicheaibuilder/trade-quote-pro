import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';

// In a larger app, these would be in their own files
const QuoteEditor = () => <div>Quote Editor Page Placeholder</div>;
const SettingsPage = () => <div>Settings Page Placeholder</div>;


function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeQuoteId, setActiveQuoteId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          setUserData(doc.exists() ? doc.data() : { email: firebaseUser.email });
        });
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setLoading(false);
        return () => unsubscribeFirestore();
      } else {
        setUser(null); setUserData(null); setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = () => signOut(auth);

  const renderView = () => {
    switch(currentView) {
      case 'editor':
        return <QuoteEditor />; // This is a placeholder for the full editor
      case 'settings':
        return <SettingsPage />; // Placeholder for settings
      case 'dashboard':
      default:
        return <Dashboard user={user} userData={userData} onLogout={handleLogout} />;
    }
  };

  if (loading) {
    return <div style={{textAlign:'center', padding:'4rem', fontFamily:'Inter, sans-serif'}}>Loading Application...</div>;
  }
  
  return <div>{user ? renderView() : <AuthPage />}</div>;
}

export default App;