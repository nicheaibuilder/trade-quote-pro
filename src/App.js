import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import QuoteEditor from './pages/QuoteEditor';

function App() {
    // ... state variables are unchanged ...
    
    // ... useEffect and dashboardStats are unchanged ...

    // --- HANDLERS ---
    const handleLogout = () => { signOut(auth); };
    const handleCreateNewQuote = () => { /* ... unchanged ... */ };
    const handleSelectQuote = (quoteId) => { /* ... unchanged ... */ };

    const handleSaveData = async (data, type) => { // 'type' can be 'quotes', 'clients', or 'items'
        const userDocRef = doc(db, "users", user.uid);
        const existingData = userData[type] || [];
        const itemExists = existingData.some(item => item.id === data.id);
        
        const updatedData = itemExists
            ? existingData.map(item => item.id === data.id ? data : item)
            : [...existingData, data];
        
        await updateDoc(userDocRef, { [type]: updatedData });
        
        if (type === 'quotes') {
            setCurrentView('dashboard');
        }
    };

    // --- RENDER LOGIC ---
    if (loading) { /* ... unchanged ... */ }
    if (!user) { return <AuthPage />; }
    
    if (currentView === 'editor') {
        return <QuoteEditor 
                  initialQuoteData={activeQuote}
                  clients={userData.clients || []}
                  items={userData.items || []} // Pass items to the editor
                  onSave={(quote) => handleSaveData(quote, 'quotes')}
                  onCancel={() => setCurrentView('dashboard')}
               />
    }

    return (
        <Dashboard 
          user={user} userData={userData} dashboardStats={dashboardStats} 
          onLogout={handleLogout}
          onCreateNewQuote={handleCreateNewQuote}
          onSelectQuote={handleSelectQuote}
          onSaveClient={(client) => handleSaveData(client, 'clients')}
          onSaveItem={(item) => handleSaveData(item, 'items')} // Add the new handler
        />
    );
}

export default App;