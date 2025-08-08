import React from 'react';

export default function Dashboard({ user, userData, onLogout }) {
    if (!userData) {
        return <div>Loading dashboard...</div>
    }
    const handleNewQuote = () => {
        alert("This is where the real app would show the Quote Editor component.");
    };

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'900px', margin:'2rem auto', padding:'2rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #e2e8f0', paddingBottom:'1rem', marginBottom:'1.5rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {user.email}</p>
                </div>
                <button onClick={onLogout} style={{background:'#a0aec0', padding:'0.6rem 1rem', borderRadius:'6px', border:'none', cursor:'pointer'}}>Log Out</button>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2>
                <button onClick={handleNewQuote} style={{background:'#3182ce', color:'white', padding:'0.6rem 1.2rem', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600'}}>
                    + New Quote
                </button>
            </div>
            <div style={{background:'white', borderRadius:'8px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', padding:'2rem', textAlign:'center', color:'#718096'}}>
                {userData.quotes && userData.quotes.length > 0 ? (
                    <p>You have {userData.quotes.length} quote(s).</p>
                ) : (
                    <p>You have no quotes yet. Click "+ New Quote" to get started.</p>
                )}
            </div>
        </div>
    );
}