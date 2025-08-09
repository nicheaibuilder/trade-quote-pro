import React, { useState } from 'react';

export default function ClientEditor({ onSave, onCancel }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        if (name && address) {
            // Create a new client object with a unique ID
            onSave({ id: `client-${Date.now()}`, name, address });
        }
    };

    return (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background:'white', padding:'2rem', borderRadius:'12px', width:'450px'}}>
                <h2 style={{marginTop:0}}>Add New Client</h2>
                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Client Name" style={{padding:'0.75rem', borderRadius:'6px', border:'1px solid #cbd5e0'}} />
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Client Address" style={{padding:'0.75rem', borderRadius:'6px', border:'1px solid #cbd5e0'}} />
                </div>
                <div style={{marginTop:'1.5rem', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
                    <button onClick={onCancel} style={{background:'#a0aec0'}}>Cancel</button>
                    <button onClick={handleSave} style={{background:'#38a169', color:'white'}}>Save Client</button>
                </div>
            </div>
        </div>
    );
}