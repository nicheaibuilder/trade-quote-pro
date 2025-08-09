import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import AuthPage from '../components/AuthPage';
import Dashboard from './pages/Dashboard';
import QuoteEditor from './pages/QuoteEditor';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for routing/views
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, editor
  const [activeQuote, setActiveQuote] = useState(null);

  useEffect(() => { /* ... No changes here ... */
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
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const dashboardStats = useMemo(() => { /* ... No changes here ... */
    if (!userData) return { totalRevenue: 0, outstandingRevenue: 0, approvalRate: 0 };
    const { quotes = [], invoices = [] } = userData;
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.total || 0), 0);
    const outstandingRevenue = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.total || 0), 0);
    const approvedCount = quotes.filter(q => q.status === 'Approved').length;
    const declinedCount = quotes.filter(q => q.status === 'Declined').length;
    const totalDecided = approvedCount + declinedCount;
    const approvalRate = totalDecided > 0 ? Math.round((approvedCount / totalDecided) * 100) : 0;
    return { totalRevenue, outstandingRevenue, approvalRate };
  }, [userData]);

  // --- HANDLERS ---
  const handleLogout = () => { signOut(auth); };

  const handleCreateNewQuote = () => {
    setActiveQuote({
      id: Date.now().toString(), // Use a string for the ID
      quoteNumber: Math.floor(10000 + Math.random() * 90000),
      clientName: '',
      clientAddress: '',
      status: 'Draft',
      lineItems: [{ id: Date.now(), description: '', quantity: 1, price: 0.00 }]
    });
    setCurrentView('editor');
  };
  
  const handleSelectQuote = (quoteId) => {
    const quoteToEdit = userData.quotes.find(q => q.id === quoteId);
    if (quoteToEdit) {
        setActiveQuote(quoteToEdit);
        setCurrentView('editor');
    }
  };

  const handleSaveQuote = async (quoteData) => {
    const userDocRef = doc(db, "users", user.uid);
    const existingQuotes = userData.quotes || [];
    const quoteExists = existingQuotes.some(q => q.id === quoteData.id);
    
    let updatedQuotes;
    if (quoteExists) {
        // Update existing quote
        updatedQuotes = existingQuotes.map(q => q.id === quoteData.id ? quoteData : q);
    } else {
        // Add new quote
        updatedQuotes = [...existingQuotes, quoteData];
    }
    
    await updateDoc(userDocRef, { quotes: updatedQuotes });
    setCurrentView('dashboard'); // Return to dashboard after save
  };


  // --- RENDER LOGIC ---
  if (loading) {
    return <div style={{textAlign:'center', padding:'4rem', fontFamily:'Inter, sans-serif'}}>Loading Application...</div>;
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  if (currentView === 'editor') {
    return <QuoteEditor 
              initialQuoteData={activeQuote}
              onSave={handleSaveQuote}
              onCancel={() => setCurrentView('dashboard')}
           />
  }

  // Default view is the dashboard
  return (
    <Dashboard 
      user={user} 
      userData={userData} 
      dashboardStats={dashboardStats} 
      onLogout={handleLogout}
      onCreateNewQuote={handleCreateNewQuote}
      onSelectQuote={handleSelectQuote}
    />
  );
}

export default App;