import React, { useState, useEffect, useMemo } from 'react';
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
  const handleCreateNewQuote = () => { setActiveQuote({ id: Date.now().toString(), quoteNumber: Math.floor(10000 + Math.random() * 90000), clientName: '', status: 'Draft', lineItems: [] }); setCurrentView('editor'); };
  const handleSelectQuote = (quoteId) => { const quoteToEdit = userData.quotes.find(q => q.id === quoteId); if (quoteToEdit) { setActiveQuote(quoteToEdit); setCurrentView('editor'); } };
  const handleSaveData = async (data, type) => {
    const userDocRef = doc(db, "users", user.uid);
    const existingData = userData[type] || [];
    const itemExists = existingData.some(item => item.id === data.id);
    const updatedData = itemExists ? existingData.map(item => item.id === data.id ? data : item) : [...existingData, data];
    await updateDoc(userDocRef, { [type]: updatedData });
    if (type === 'quotes') { setCurrentView('dashboard'); }
  };
  const handleUpdateQuoteStatus = async (quoteId, newStatus) => {
    const userDocRef = doc(db, "users", user.uid);
    const updatedQuotes = userData.quotes.map(q => q.id === quoteId ? { ...q, status: newStatus } : q);
    await updateDoc(userDocRef, { quotes: updatedQuotes });
  };
  const handleConvertToInvoice = async (quoteId) => {
    const quote = userData.quotes.find(q => q.id === quoteId);
    if (!quote) return;
    const newInvoice = { ...quote, id: `inv-${Date.now()}`, invoiceNumber: `INV-${quote.quoteNumber}`, invoiceDate: new Date().toLocaleDateString('en-CA'), dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'), status: 'Unpaid' };
    const updatedQuotes = userData.quotes.map(q => q.id === quoteId ? { ...q, status: 'Invoiced' } : q);
    const updatedInvoices = [...(userData.invoices || []), newInvoice];
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { quotes: updatedQuotes, invoices: updatedInvoices });
  };
  const handleMarkInvoicePaid = async (invoiceId) => {
    const userDocRef = doc(db, "users", user.uid);
    const updatedInvoices = userData.invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv);
    await updateDoc(userDocRef, { invoices: updatedInvoices });
  };
  
  // --- RENDER LOGIC ---
  const renderView = () => {
    // THIS HANDLERS OBJECT IS NOW VERIFIED AND CORRECT
    const handlers = { 
        onLogout: handleLogout, 
        onCreateNewQuote: handleCreateNewQuote,
        onSelectQuote: handleSelectQuote,
        onSaveClient: (client) => handleSaveData(client, 'clients'),
        onSaveItem: (item) => handleSaveData(item, 'items'),
        onUpdateQuoteStatus: handleUpdateQuoteStatus,
        onConvertToInvoice: handleConvertToInvoice,
        onMarkInvoicePaid: handleMarkInvoicePaid,
    };

    if (currentView === 'editor') { return <QuoteEditor initialQuoteData={activeQuote} clients={userData.clients||[]} items={userData.items||[]} onSave={(q)=>handleSaveData(q,'quotes')} onCancel={()=>setCurrentView('dashboard')} />; }
    return <Dashboard user={user} userData={userData} dashboardStats={dashboardStats} handlers={handlers} />;
  };

  if (loading) { return <div style={{textAlign:'center', padding:'4rem'}}>Loading...</div>; }
  return <div>{user ? renderView() : <AuthPage />}</div>;
}

export default App;