import { useState, useEffect } from 'react';
import Header from './components/Header';
import TopicSelector from './components/TopicSelector';
import DifficultySelector from './components/DifficultySelector';
import ProblemDisplay from './components/ProblemDisplay';
import InputArea from './components/InputArea';
import SolutionBox from './components/SolutionBox';

import {
    generateSingleStandard, generateSingleBrackets, generateSingleIntermediate, generateSingleAdvanced, generateSingleMastery,
    generateSimulStandard, generateSimulBrackets, generateSimulIntermediate, generateSimulAdvanced, generateSimulMastery,
    generateQuadStandard, generateQuadBrackets, generateQuadIntermediate, generateQuadMastery,
    generateExpProblem, generateFactProblem, generateIndProblem, generateLogProblem
} from './utils/problemGenerator';

const initialInputs = { x: '', y: '', x1: '', x2: '', ineqSign: '<', userMCQ: null };

export default function App() {
    const [currentMode, setCurrentMode] = useState('single');
    const [difficulty, setDifficulty] = useState('standard');
    const [problemData, setProblemData] = useState(null);
    const [userInputs, setUserInputs] = useState(initialInputs);
    const [feedback, setFeedback] = useState(null);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        generateProblem();
    }, [currentMode, difficulty]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
                    checkAnswer();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [problemData, userInputs, currentMode]);

    const handleSwitchMode = (mode) => {
        setCurrentMode(mode);
        setDifficulty('standard');
    };

    const handleInputChange = (field, value) => {
        setUserInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleMCQSelect = (idx) => {
        setUserInputs(prev => ({ ...prev, userMCQ: idx }));
    };

    const generateProblem = () => {
        setFeedback(null);
        setShowSolution(false);
        setUserInputs(initialInputs);

        let data = null;
        let isIneq = currentMode === 'ineq';

        if (currentMode === 'single' || currentMode === 'ineq') {
            if (difficulty === 'standard') data = generateSingleStandard(isIneq);
            else if (difficulty === 'brackets') data = generateSingleBrackets(isIneq);
            else if (difficulty === 'intermediate') data = generateSingleIntermediate(isIneq);
            else if (difficulty === 'advanced') data = generateSingleAdvanced(isIneq);
            else data = generateSingleMastery(isIneq);
        } else if (currentMode === 'simul') {
            if (difficulty === 'standard') data = generateSimulStandard();
            else if (difficulty === 'brackets') data = generateSimulBrackets();
            else if (difficulty === 'intermediate') data = generateSimulIntermediate();
            else if (difficulty === 'advanced') data = generateSimulAdvanced();
            else data = generateSimulMastery();
        } else if (currentMode === 'quad') {
            if (difficulty === 'standard') data = generateQuadStandard();
            else if (difficulty === 'brackets') data = generateQuadBrackets();
            else if (difficulty === 'intermediate') data = generateQuadIntermediate();
            else data = generateQuadMastery();
        } else if (currentMode === 'exp') {
            data = generateExpProblem(difficulty);
        } else if (currentMode === 'fact') {
            data = generateFactProblem(difficulty);
        } else if (currentMode === 'ind') {
            data = generateIndProblem(difficulty);
        } else if (currentMode === 'log') {
            data = generateLogProblem(difficulty);
        }
        
        setProblemData(data);
    };

    const checkAnswer = () => {
        if (!problemData) return;
        let isCorrect = false;
        let isEmpty = false;

        if (currentMode === 'single' || currentMode === 'ind' || currentMode === 'log') {
            if (userInputs.x === '') isEmpty = true;
            else if (parseFloat(userInputs.x) === problemData.ansX) isCorrect = true;
        } else if (currentMode === 'simul') {
            if (userInputs.x === '' || userInputs.y === '') isEmpty = true;
            else if (parseInt(userInputs.x) === problemData.ansX && parseInt(userInputs.y) === problemData.ansY) isCorrect = true;
        } else if (currentMode === 'ineq') {
            if (userInputs.x === '') isEmpty = true;
            else if (parseInt(userInputs.x) === problemData.ansX && userInputs.ineqSign === problemData.ansSign) isCorrect = true;
        } else if (currentMode === 'quad') {
            const userX1 = parseFloat(userInputs.x1);
            const userX2 = parseFloat(userInputs.x2);
            if (isNaN(userX1) || isNaN(userX2)) isEmpty = true;
            else {
                if ((Math.abs(userX1 - problemData.ansX1) < 0.01 && Math.abs(userX2 - problemData.ansX2) < 0.01) ||
                    (Math.abs(userX1 - problemData.ansX2) < 0.01 && Math.abs(userX2 - problemData.ansX1) < 0.01)) {
                    isCorrect = true;
                }
            }
        } else if (currentMode === 'exp' || currentMode === 'fact') {
            if (userInputs.userMCQ === null || userInputs.userMCQ === undefined) isEmpty = true;
            else if (userInputs.userMCQ === problemData.mcqData.ansIndex) isCorrect = true;
        }

        if (isEmpty) {
            setFeedback({ type: 'error', text: 'Please complete your answer before checking.' });
            return;
        }

        if (isCorrect) {
            setFeedback({ type: 'success', text: 'Excellent! Your answer is correct.' });
        } else {
            setFeedback({ type: 'error', text: 'Incorrect. Try again, or click "Show Steps" to see the full working method.' });
        }
    };

    let instruction = "Solve for x";
    if (currentMode === 'simul') instruction = "Solve the simultaneous equations";
    else if (currentMode === 'ineq') instruction = "Solve the Inequation";
    else if (currentMode === 'quad') instruction = "Find the roots of the Quadratic Equation";
    else if (currentMode === 'exp') instruction = "Select the correct expansion";
    else if (currentMode === 'fact') instruction = "Select the correct factors";

    return (
        <div className="container">
            <Header />
            <TopicSelector currentMode={currentMode} onSwitchMode={handleSwitchMode} />
            <DifficultySelector currentMode={currentMode} difficulty={difficulty} onChangeDifficulty={setDifficulty} />
            
            <div className="content">
                {problemData && (
                    <ProblemDisplay 
                        instruction={instruction} 
                        subtitleText={problemData.subtitleText} 
                        eqHTML={problemData.eqHTML} 
                    />
                )}

                <InputArea 
                    currentMode={currentMode} 
                    userInputs={userInputs} 
                    onInputChange={handleInputChange} 
                    mcqData={problemData?.mcqData} 
                    onMCQSelect={handleMCQSelect}
                />

                <div className="actions">
                    <button className="btn-primary" onClick={checkAnswer}>Check Answer</button>
                    <button className="btn-secondary" onClick={generateProblem}>Next Problem</button>
                    <button className="btn-secondary" onClick={() => setShowSolution(!showSolution)}>
                        {showSolution ? 'Hide Steps' : 'Show Steps'}
                    </button>
                </div>

                {feedback && (
                    <div className={`feedback ${feedback.type}`} style={{ display: 'block' }}>
                        {feedback.text}
                    </div>
                )}

                <SolutionBox show={showSolution} stepsHTML={problemData?.stepsHTML} />
            </div>
        </div>
    );
}
