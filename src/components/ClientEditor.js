import React, { useState } from 'react';

export default function ClientEditor({ onSave, onCancel }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        if (name) { // Address can be optional
            onSave({ id: `client-${Date.now()}`, name, address });
        }
    };

    return (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 100}}>
            <div style={{background:'white', padding:'2rem', borderRadius:'12px', width:'450px'}}>
                <h2 style={{marginTop:0}}>Add New Client</h2>
                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Client Name" />
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Client Address (Optional)" />
                </div>
                <div style={{marginTop:'1.5rem', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
                    <button onClick={onCancel} style={{background:'#a0aec0'}}>Cancel</button>
                    <button onClick={handleSave} style={{background:'#38a169', color:'white'}}>Save Client</button>
                </div>
            </div>
        </div>
    );
}