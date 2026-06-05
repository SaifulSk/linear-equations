const topics = [
    { id: 'single', name: 'Linear Equations' },
    { id: 'simul', name: 'Simultaneous Eq' },
    { id: 'ineq', name: 'Linear Inequalities' },
    { id: 'quad', name: 'Quadratic Eq' },
    { id: 'exp', name: 'Expansions' },
    { id: 'fact', name: 'Factorisation' },
    { id: 'ind', name: 'Indices' },
    { id: 'log', name: 'Logarithms' }
];

export default function TopicSelector({ currentMode, onSwitchMode }) {
    return (
        <>
            <div className="tabs">
                {topics.map(t => (
                    <div 
                        key={t.id} 
                        className={`tab ${currentMode === t.id ? 'active' : ''}`}
                        onClick={() => onSwitchMode(t.id)}
                    >
                        {t.name}
                    </div>
                ))}
            </div>
            <div className="mobile-mode-selector">
                <label htmlFor="mobile-mode-select" style={{fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem'}}>Select Topic:</label>
                <select id="mobile-mode-select" value={currentMode} onChange={(e) => onSwitchMode(e.target.value)}>
                    {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
        </>
    );
}
