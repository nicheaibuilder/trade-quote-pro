import React, { useState } from 'react';

export default function ItemEditor({ onSave, onCancel }) {
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleSave = () => {
        if (description && price > 0) {
            onSave({ id: `item-${Date.now()}`, description, price: parseFloat(price) });
        }
    };

    return (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 100}}>
            <div style={{background:'white', padding:'2rem', borderRadius:'12px', width:'450px'}}>
                <h2 style={{marginTop:0}}>Add Catalog Item</h2>
                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Item Description (e.g., Service Call Fee)" />
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
                </div>
                <div style={{marginTop:'1.5rem', display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
                    <button onClick={onCancel} style={{background:'#a0aec0'}}>Cancel</button>
                    <button onClick={handleSave} style={{background:'#38a169', color:'white'}}>Save Item</button>
                </div>
            </div>
        </div>
    );
}