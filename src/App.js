import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import QuoteEditor from './pages/QuoteEditor';

// Placeholders for components we will build out next
const ClientPortal = ({ onCancel }) => <div style={{padding: '2rem', fontFamily:'Inter'}}><h1>Client Portal</h1><button onClick={onCancel}>Back to Dashboard</button></div>;
const SettingsPage = ({ onCancel }) => <div style={{padding: '2rem', fontFamily:'Inter'}}><h1>Settings Page</h1><button onClick={onCancel}>Back to Dashboard</button></div>;

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
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          setUserData(doc.exists() ? doc.data() : { email: firebaseUser.email });
        });
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email }); setLoading(false);
        return () => unsubscribeFirestore();
      } else { setUser(null); setUserData(null); setLoading(false); }
    });
    return () => unsubscribeAuth();
  }, []);

  const dashboardStats = useMemo(() => {
    if (!userData) return { totalRevenue: 0, outstandingRevenue: 0, approvalRate: 0 };
    const { quotes = [], invoices = [] } = userData;
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.total || 0), 0);
    const outstandingRevenue = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.total || 0), 0);
    const approvedCount = quotes.filter(q => q.status === 'Approved' || q.status === 'Invoiced').length;
    const declinedCount = quotes.filter(q => q.status === 'Declined').length;
    const totalDecided = approvedCount + declinedCount;
    const approvalRate = totalDecided > 0 ? Math.round((approvedCount / totalDecided) * 100) : 0;
    return { totalRevenue, outstandingRevenue, approvalRate };
  }, [userData]);

  // --- HANDLERS ---
  const handleLogout = () => signOut(auth);

  const handleCreateNewQuote = () => {
    setActiveQuote({
      id: Date.now().toString(), quoteNumber: Math.floor(10000 + Math.random() * 90000),
      clientName: '', clientAddress: '', status: 'Draft',
      lineItems: []
    });
    setCurrentView('editor');
  };
  
  const handleSelectQuote = (quoteId) => {
    const quoteToEdit = userData.quotes.find(q => q.id === quoteId);
    if (quoteToEdit) { setActiveQuote(quoteToEdit); setCurrentView('editor'); }
  };

  const handleSaveQuote = async (quoteData) => {
    const userDocRef = doc(db, "users", user.uid);
    const existingQuotes = userData.quotes || [];
    const quoteExists = existingQuotes.some(q => q.id === quoteData.id);
    
    const updatedQuotes = quoteExists
        ? existingQuotes.map(q => q.id === quoteData.id ? quoteData : q)
        : [...existingQuotes, quoteData];
    
    await updateDoc(userDocRef, { quotes: updatedQuotes });
    setCurrentView('dashboard');
  };
  
  const handleGetClientLink = (quoteId) => {
    setActiveQuote(userData.quotes.find(q => q.id === quoteId));
    setCurrentView('clientPortal');
  };
  
  // --- RENDER LOGIC ---
  const renderView = () => {
    const handlers = {
        // CORRECTED LINE: The key is 'onLogout' and the value is the function 'handleLogout'
        onLogout: handleLogout,
        onCreateNewQuote: handleCreateNewQuote,
        onSelectQuote: handleSelectQuote,
        onGetClientLink: handleGetClientLink,
        onGoToSettings: () => setCurrentView('settings'),
    };

    switch(currentView) {
      case 'editor':
        return <QuoteEditor 
                  initialQuoteData={activeQuote}
                  clients={userData.clients || []}
                  items={userData.items || []}
                  onSave={handleSaveQuote}
                  onCancel={() => setCurrentView('dashboard')}
               />;
      case 'settings': return <SettingsPage onCancel={() => setCurrentView('dashboard')} />;
      case 'clientPortal': return <ClientPortal onCancel={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard 
          user={user} 
          userData={userData} 
          dashboardStats={dashboardStats} 
          handlers={handlers}
        />;
    }
  };

  if (loading) { return <div style={{textAlign:'center', padding:'4rem'}}>Loading...</div>; }
  
  return <div>{user ? renderView() : <AuthPage />}</div>;
}

export default App;