export default function InputArea({ currentMode, userInputs, onInputChange, mcqData, onMCQSelect }) {
    if (currentMode === 'single' || currentMode === 'ind' || currentMode === 'log') {
        return (
            <div className="input-section">
                <div className="input-group">
                    <label>x =</label>
                    <input type="number" value={userInputs.x} onChange={(e) => onInputChange('x', e.target.value)} placeholder="Value" autoComplete="off" />
                </div>
            </div>
        );
    } else if (currentMode === 'simul') {
        return (
            <div className="input-section">
                <div className="input-group">
                    <label>x =</label>
                    <input type="number" value={userInputs.x} onChange={(e) => onInputChange('x', e.target.value)} placeholder="Value" autoComplete="off" />
                </div>
                <div className="input-group">
                    <label>y =</label>
                    <input type="number" value={userInputs.y} onChange={(e) => onInputChange('y', e.target.value)} placeholder="Value" autoComplete="off" />
                </div>
            </div>
        );
    } else if (currentMode === 'ineq') {
        return (
            <div className="input-section">
                <div className="input-group">
                    <label>x</label>
                    <select value={userInputs.ineqSign} onChange={(e) => onInputChange('ineqSign', e.target.value)}>
                        <option value="<">&lt;</option>
                        <option value="<=">&le;</option>
                        <option value=">">&gt;</option>
                        <option value=">=">&ge;</option>
                    </select>
                    <input type="number" value={userInputs.x} onChange={(e) => onInputChange('x', e.target.value)} placeholder="Value" autoComplete="off" />
                </div>
            </div>
        );
    } else if (currentMode === 'quad') {
        return (
            <div className="input-section">
                <div className="input-group">
                    <label>x =</label>
                    <input type="number" value={userInputs.x1} onChange={(e) => onInputChange('x1', e.target.value)} placeholder="Root 1" autoComplete="off" />
                </div>
                <div className="input-group">
                    <label>or x =</label>
                    <input type="number" value={userInputs.x2} onChange={(e) => onInputChange('x2', e.target.value)} placeholder="Root 2" autoComplete="off" />
                </div>
            </div>
        );
    } else if (currentMode === 'exp' || currentMode === 'fact') {
        if (!mcqData || !mcqData.options) return null;
        return (
            <div className="input-section">
                <div className="mcq-grid">
                    {mcqData.options.map((opt, idx) => (
                        <div 
                            key={idx} 
                            className={`mcq-option ${userInputs.userMCQ === idx ? 'selected' : ''}`}
                            onClick={() => onMCQSelect(idx)}
                            dangerouslySetInnerHTML={{ __html: opt.str }}
                        />
                    ))}
                </div>
            </div>
        );
    }
    return null;
}
