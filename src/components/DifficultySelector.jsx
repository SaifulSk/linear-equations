export default function DifficultySelector({ currentMode, difficulty, onChangeDifficulty }) {
    let options = [];
    if (currentMode === 'single' || currentMode === 'simul' || currentMode === 'ineq') {
        options = [
            { val: 'standard', text: 'Standard Level' },
            { val: 'brackets', text: 'Standard Level (Brackets)' },
            { val: 'intermediate', text: 'Intermediate Level' },
            { val: 'advanced', text: 'Advanced Level' },
            { val: 'mastery', text: 'Mastery Level' }
        ];
    } else if (currentMode === 'quad') {
        options = [
            { val: 'standard', text: 'Standard Level (Basic)' },
            { val: 'brackets', text: 'Standard Level (Expansions)' },
            { val: 'intermediate', text: 'Intermediate Level (Fractions)' },
            { val: 'mastery', text: 'Mastery Level (Reducible)' }
        ];
    } else {
        options = [
            { val: 'standard', text: 'Standard Level' },
            { val: 'intermediate', text: 'Intermediate Level' },
            { val: 'advanced', text: 'Advanced Level' },
            { val: 'mastery', text: 'Mastery Level' }
        ];
    }

    return (
        <div className="controls">
            <label htmlFor="difficulty-level" style={{fontWeight: 600, color: 'var(--text-muted)'}}>Difficulty Level:</label>
            <select id="difficulty-level" value={difficulty} onChange={(e) => onChangeDifficulty(e.target.value)}>
                {options.map(o => (
                    <option key={o.val} value={o.val}>{o.text}</option>
                ))}
            </select>
        </div>
    );
}
