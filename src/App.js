import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import QuoteEditor from './pages/QuoteEditor';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeQuote, setActiveQuote] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => { setUserData(doc.exists() ? doc.data() : { email: firebaseUser.email }); });
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email }); setLoading(false);
        return () => unsubscribeFirestore();
      } else { setUser(null); setUserData(null); setLoading(false); }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- HANDLERS ---
  const handleLogout = () => signOut(auth);

  const handleCreateNewQuote = () => {
    setActiveQuote({ id: Date.now().toString(), quoteNumber: Math.floor(10000 + Math.random() * 90000), clientName: '', status: 'Draft', lineItems: [] });
    setCurrentView('editor');
  };
  
  const handleSelectQuote = (quoteId) => {
    const quoteToEdit = userData.quotes.find(q => q.id === quoteId);
    if (quoteToEdit) { setActiveQuote(quoteToEdit); setCurrentView('editor'); }
  };

  const handleSaveData = async (data, type) => {
    const userDocRef = doc(db, "users", user.uid);
    const existingData = userData[type] || [];
    const itemExists = existingData.some(item => item.id === data.id);
    const updatedData = itemExists ? existingData.map(item => item.id === data.id ? data : item) : [...existingData, data];
    await updateDoc(userDocRef, { [type]: updatedData });
    if (type === 'quotes') { setCurrentView('dashboard'); }
  };
  
  // --- RENDER LOGIC ---
  const renderView = () => {
    const handlers = {
        // CORRECTED LINE
        onLogout: handleLogout, 
        onCreateNewQuote: handleCreateNewQuote,
        onSelectQuote: handleSelectQuote,
        onSaveClient: (client) => handleSaveData(client, 'clients'),
        onSaveItem: (item) => handleSaveData(item, 'items'),
    };

    switch(currentView) {
      case 'editor':
        return <QuoteEditor 
                  initialQuoteData={activeQuote}
                  clients={userData.clients || []}
                  items={userData.items || []}
                  onSave={(quote) => handleSaveData(quote, 'quotes')}
                  onCancel={() => setCurrentView('dashboard')}
               />;
      default:
        return <Dashboard user={user} userData={userData} handlers={handlers} />;
    }
  };

  if (loading) { return <div style={{textAlign:'center', padding:'4rem'}}>Loading...</div>; }
  
  return <div>{user ? renderView() : <AuthPage />}</div>;
}

export default App;