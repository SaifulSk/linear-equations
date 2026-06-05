export default function SolutionBox({ show, stepsHTML }) {
    if (!show || !stepsHTML) return null;
    return (
        <div className="solution-container" id="solution-box">
            <div className="solution-header">Step-by-Step ICSE Working</div>
            <div className="solution-steps" id="solution-steps" dangerouslySetInnerHTML={{ __html: stepsHTML }}>
            </div>
        </div>
    );
}
