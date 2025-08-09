import React, { useState, useMemo } from 'react';

const Input = ({ label, ...props }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>{label}</label>
        <input {...props} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
    </div>
);

export default function QuoteEditor({ initialQuoteData, clients = [], onSave, onCancel }) {
    const [quote, setQuote] = useState(initialQuoteData);

    const handleClientSelect = (e) => {
        const selectedClientId = e.target.value;
        const selectedClient = clients.find(c => c.id === selectedClientId);
        if (selectedClient) {
            setQuote(prev => ({ ...prev, clientName: selectedClient.name, clientAddress: selectedClient.address }));
        } else {
             setQuote(prev => ({ ...prev, clientName: '', clientAddress: '' }));
        }
    };

    const handleItemChange = (itemId, field, value) => {
        const updatedItems = quote.lineItems.map(item => {
            if (item.id === itemId) {
                const numericValue = (field === 'quantity' || field === 'price') ? parseFloat(value) || 0 : value;
                return { ...item, [field]: numericValue };
            }
            return item;
        });
        setQuote(prev => ({ ...prev, lineItems: updatedItems }));
    };
    
    const handleAddItem = () => {
        const newItem = { id: Date.now(), description: '', quantity: 1, price: 0.00 };
        setQuote(prev => ({...prev, lineItems: [...prev.lineItems, newItem]}));
    };
    
    const handleRemoveItem = (itemId) => {
        const updatedItems = quote.lineItems.filter(item => item.id !== itemId);
        setQuote(prev => ({ ...prev, lineItems: updatedItems }));
    };

    const subtotal = useMemo(() => quote.lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0), [quote.lineItems]);
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'900px', margin:'2rem auto', padding:'2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #e2e8f0', paddingBottom:'1rem', marginBottom:'1.5rem'}}>
                <div>
                    <h1 style={{margin:0}}>Quote Editor</h1>
                    <p style={{margin:0, color:'#718096'}}>Quote #{quote.quoteNumber}</p>
                </div>
                <div>
                    <button onClick={onCancel} style={{background:'#a0aec0', marginRight:'1rem'}}>Cancel</button>
                    <button onClick={() => onSave({ ...quote, total: total })} style={{background:'#38a169', color:'white'}}>Save Quote</button>
                </div>
            </div>

            <div style={{marginBottom:'2rem'}}>
                <h2 style={{fontSize:'1.25rem'}}>Client Information</h2>
                 <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    <select onChange={handleClientSelect} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', background:'white' }}>
                        <option value="">-- Select an Existing Client --</option>
                        {clients.map(client => (<option key={client.id} value={client.id}>{client.name}</option>))}
                    </select>
                    <Input label="Or Enter New Client Name" value={quote.clientName} onChange={e => setQuote(p=>({...p, clientName: e.target.value}))} />
                    <Input label="Or Enter New Client Address" value={quote.clientAddress} onChange={e => setQuote(p=>({...p, clientAddress: e.target.value}))} />
                </div>
            </div>

            <div>
                <h2 style={{fontSize:'1.25rem'}}>Line Items</h2>
                {quote.lineItems.map(item => (
                    <div key={item.id} style={{display:'grid', gridTemplateColumns:'4fr 1fr 1fr 0.5fr', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
                        <Input label="Description" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                        <Input label="Quantity" type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} />
                        <Input label="Unit Price" type="number" value={item.price} onChange={e => handleItemChange(item.id, 'price', e.target.value)} />
                        <button onClick={() => handleRemoveItem(item.id)} style={{background:'#e53e3e', color:'white', height:'40px', marginTop:'auto'}}>X</button>
                    </div>
                ))}
                <button onClick={handleAddItem} style={{background:'#3182ce', color:'white'}}>+ Add Item</button>
            </div>
            
            <div style={{marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'flex-end'}}>
                <div style={{width:'300px', fontSize:'1.1rem'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}><span style={{color:'#718096'}}>Subtotal:</span> <strong>${subtotal.toFixed(2)}</strong></div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}><span style={{color:'#718096'}}>Tax (13%):</span> <strong>${tax.toFixed(2)}</strong></div>
                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.4rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'2px solid black'}}><span>Total:</span> <span>${total.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
}