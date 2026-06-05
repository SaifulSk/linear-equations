export default function ProblemDisplay({ instruction, subtitleText, eqHTML }) {
    return (
        <div className="problem-section">
            <div className="problem-title">{instruction}</div>
            {subtitleText && <div className="problem-subtitle">{subtitleText}</div>}
            <div className="equation-display" dangerouslySetInnerHTML={{ __html: eqHTML }} />
        </div>
    );
}
