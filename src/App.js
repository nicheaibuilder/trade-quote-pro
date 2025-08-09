import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import AuthPage from '../components/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const dashboardStats = useMemo(() => {
    if (!userData) return { totalRevenue: 0, outstandingRevenue: 0, approvalRate: 0 };
    
    const { quotes = [], invoices = [] } = userData;
    
    const totalRevenue = invoices
        .filter(i => i.status === 'Paid')
        .reduce((sum, i) => sum + (i.total || 0), 0);
        
    const outstandingRevenue = invoices
        .filter(i => i.status === 'Unpaid' || i.status === 'Overdue')
        .reduce((sum, i) => sum + (i.total || 0), 0);

    const approvedCount = quotes.filter(q => q.status === 'Approved' || q.status === 'Invoiced').length;
    const declinedCount = quotes.filter(q => q.status === 'Declined').length;
    const totalDecided = approvedCount + declinedCount;
    const approvalRate = totalDecided > 0 ? Math.round((approvedCount / totalDecided) * 100) : 0;
    
    return { totalRevenue, outstandingRevenue, approvalRate };
  }, [userData]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div style={{textAlign:'center', padding:'4rem', fontFamily:'Inter, sans-serif'}}>Loading Application...</div>;
  }

  return (
    <div>
      {user ? (
        <Dashboard 
          user={user} 
          userData={userData} 
          dashboardStats={dashboardStats} 
          onLogout={handleLogout} 
        />
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;