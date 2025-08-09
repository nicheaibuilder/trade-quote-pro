import React from 'react';

export default function CatalogModal({ items, onAddItem, onCancel }) {
    return (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
            <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', width:'500px', maxHeight:'80vh', display:'flex', flexDirection:'column'}}>
                <h2 style={{marginTop:0}}>Add from Catalog</h2>
                <div style={{overflowY:'auto', flexGrow:1, borderTop:'1px solid #e2e8f0', borderBottom:'1px solid #e2e8f0'}}>
                    {items.map(item => (
                        <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem', borderBottom:'1px solid #e2e8f0'}}>
                            <div>
                                <p style={{margin:0, fontWeight:'500'}}>{item.description}</p>
                                <p style={{margin:0, color:'#718096'}}>${item.price.toFixed(2)}</p>
                            </div>
                            <button onClick={()=>onAddItem(item)} style={{background:'#3182ce', color:'white'}}>+</button>
                        </div>
                    ))}
                </div>
                <button onClick={onCancel} style={{marginTop:'1.5rem', background:'#a0aec0'}}>Close</button>
            </div>
        </div>
    );
}