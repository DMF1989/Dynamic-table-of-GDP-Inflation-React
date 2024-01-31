  export function EditableIndex({ value, onChange }) {
    return <input type="text" min='0' value={value} onChange={e => onChange(e.target.value)} />;
  };
  
  export function EditableCell({ value, onChange }) {
    return <input type="number" min='0' value={value} onChange={e => onChange(e.target.value)} />;
  };
  
  export function EditableYear({ value, onChange }) {
    return <input type="number" min='0' value={value} onChange={e => onChange(e.target.value)} />;
  };
  
  export function EditableCategory(
    { value, onChange }) { return <input type='text' value={value} onChange={e => onChange(e.target.value)} />; };
 
/*     style={{color: index >= 0 && index < 5? "lightseagreen" : index >= 5 ? "dodgerblue" : "orange"}} */