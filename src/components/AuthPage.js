import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // Create a document for the new user in Firestore with all data structures
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date(),
                    profile: { companyName: "Your Company Name", address: "", phone: "" },
                    quotes: [],
                    invoices: [],
                    clients: [],
                    items: []
                });
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };
    return ( <div style={{fontFamily:'Inter, sans-serif',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',backgroundColor:'#f7fafc'}}><div style={{background:'white',padding:'2.5rem',borderRadius:'12px',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)',width:'100%',maxWidth:'400px',textAlign:'center'}}><h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1><form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{padding:'0.75rem',borderRadius:'6px',border:'1px solid #cbd5e0'}}/><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{padding:'0.75rem',borderRadius:'6px',border:'1px solid #cbd5e0'}}/><button type="submit" style={{background:'#2d3748',color:'white',padding:'0.75rem',fontWeight:'600'}}>{isLogin ? 'Log In' : 'Sign Up'}</button></form>{error && <p style={{color:'red', marginTop:'1rem'}}>{error}</p>}<button onClick={() => setIsLogin(!isLogin)} style={{color:'#4299e1',cursor:'pointer',background:'none',border:'none',padding:0,marginTop:'1.5rem'}}>{isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}</button></div></div> );
}