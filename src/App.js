import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';

// Placeholders for components we will build out next
const QuoteEditor = ({ onCancel }) => <div style={{padding: '2rem', fontFamily:'Inter'}}><h1 >Quote Editor</h1><p>The full editor for creating quotes would be built here.</p><button onClick={onCancel}>Back to Dashboard</button></div>;
const ClientPortal = ({ onCancel }) => <div style={{padding: '2rem', fontFamily:'Inter'}}><h1>Client Portal</h1><p>The client-facing page for approving quotes would be built here.</p><button onClick={onCancel}>Back to Dashboard</button></div>;
const SettingsPage = ({ onCancel }) => <div style={{padding: '2rem', fontFamily:'Inter'}}><h1>Settings</h1><p>The page for updating company branding and profile would be built here.</p><button onClick={onCancel}>Back to Dashboard</button></div>;


function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeItemId, setActiveItemId] = useState(null);

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
  const handleCreateNewQuote = () => { setActiveItemId(null); setCurrentView('editor'); };
  const handleSelectQuote = (id) => { setActiveItemId(id); setCurrentView('editor'); };
  const handleGetClientLink = (id) => { setActiveItemId(id); setCurrentView('clientPortal'); };
  const handleGoToSettings = () => setCurrentView('settings');
  
  const handlers = {
      onLogout: handleLogout,
      onCreateNewQuote: handleCreateNewQuote,
      onSelectQuote: handleSelectQuote,
      onGetClientLink: handleGetClientLink,
      onGoToSettings: handleGoToSettings
  };

  const renderView = () => {
    switch(currentView) {
      case 'editor': return <QuoteEditor onCancel={() => setCurrentView('dashboard')} />;
      case 'settings': return <SettingsPage onCancel={() => setCurrentView('dashboard')} />;
      case 'clientPortal': return <ClientPortal onCancel={() => setCurrentView('dashboard')} />;
      default:
        // The 'handlers' object is now correctly created and passed as a prop
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