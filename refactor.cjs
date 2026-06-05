const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'utils', 'legacyScript.js');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Export utilities
const utilsToExport = [
    'getRandomInt', 'gcd', 'lcm', 'lcm3', 'simplifyFraction',
    'getIneqSymbol', 'getIneqRaw', 'flipIneq', 'shuffleArray',
    'fmtTerm', 'formatPolynomial', 'buildFraction', 'formatLinearBinomial',
    'formatFractionTerm', 'formatFractionEq', 'formatFractionWithParens'
];
utilsToExport.forEach(fn => {
    code = code.replace(`function ${fn}(`, `export function ${fn}(`);
});

// 2. Remove all global state and UI functions
const lines = code.split(/\r?\n/);
const outputLines = [];
let skipBlock = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("let currentMode = 'single';")) continue;
    if (line.includes("let currentProblem = {};")) continue;

    // Delete unwanted functions
    if (line.includes("function selectMCQOption") ||
        line.includes("function switchMode") ||
        line.includes("function generateProblem") ||
        line.includes("function checkAnswer") ||
        line.includes("function toggleSolution") ||
        line.includes("function setupMCQ") ||
        line.includes("document.addEventListener('keypress'")) {
        skipBlock = true;
    }

    if (skipBlock) {
        if (line.startsWith("    }")) {
            skipBlock = false; // end of function block
        } else if (line.startsWith("    });")) {
            skipBlock = false; // end of addEventListener block
        }
        continue;
    }

    if (line.includes("window.onload")) {
        skipBlock = true;
        continue;
    }

    outputLines.push(line);
}

// 3. Now we have a clean code string, add setupMCQ back
code = outputLines.join('\n');

code = `export function setupMCQ(correctStr, w1, w2, w3) {
    let options = [{str: correctStr, correct: true}, {str: w1, correct: false}, {str: w2, correct: false}, {str: w3, correct: false}];
    shuffleArray(options);
    return {
        ansIndex: options.findIndex(o => o.correct),
        options: options
    };
}\n\n` + code;

// 4. Refactor all generateXXX functions
const genRegex = /function (generate[a-zA-Z0-9_]+)\((.*?)\)\s*\{([\s\S]*?)\n    \}/g;
let match;

code = code.replace(genRegex, (match, fnName, args, body) => {
    let newBody = body;

    newBody = newBody.replace(/currentProblem = (.*?);/g, 'let problemData = $1;');
    newBody = newBody.replace(/document\.getElementById\('equation-display'\)\.innerHTML = (.*?);/g, 'let eqHTML = $1;');
    newBody = newBody.replace(/document\.getElementById\('solution-steps'\)\.innerHTML = (.*?);/g, 'let stepsHTML = $1;');
    
    // Fallback if previous replacement failed (for multiline innerHTML)
    newBody = newBody.replace(/document\.getElementById\('solution-steps'\)\.innerHTML =/g, 'let stepsHTML =');
    newBody = newBody.replace(/document\.getElementById\('equation-display'\)\.innerHTML =/g, 'let eqHTML =');

    newBody = newBody.replace(/let subtitle = document\.getElementById\('problem-subtitle'\);\n\s*subtitle\.style\.display = 'none';/g, 'let subtitleText = null;');
    newBody = newBody.replace(/subtitle\.innerText = (.*?);\n\s*subtitle\.style\.display = 'block';/g, 'subtitleText = $1;');

    newBody = newBody.replace(/setupMCQ\((.*?)\);/g, 'let mcqData = setupMCQ($1);');

    let returnStmt = `\n        return { ...problemData, eqHTML, stepsHTML`;
    if (newBody.includes('subtitleText')) returnStmt += `, subtitleText`;
    if (newBody.includes('mcqData')) returnStmt += `, mcqData`;
    returnStmt += ` };`;
    
    if (newBody.includes('generateSingleSameDenom(isIneq);')) {
        newBody = newBody.replace(/generateSingleSameDenom\(isIneq\);/g, 'return generateSingleSameDenom(isIneq);');
        newBody = newBody.replace(/generateSingleDiffDenom\(isIneq\);/g, 'return generateSingleDiffDenom(isIneq);');
        return `export function ${fnName}(${args}) {${newBody}\n    }`;
    }

    if (newBody.includes('generateExpProblem(level);')) return '';
    
    newBody = newBody.replace(/if \((.*?)\) \{ generateFactProblem\(level\); return; \}/g, 'if ($1) { return generateFactProblem(level); }');
    newBody = newBody.replace(/if \((.*?)\) \{ generateQuadMastery\(\); return; \}/g, 'if ($1) { return generateQuadMastery(); }');

    // Add problemData initialization if missing
    if (!newBody.includes('let problemData')) {
        newBody = `\n        let problemData = { type: '${fnName.replace('generate', '').toLowerCase()}' };` + newBody;
    }

    return `export function ${fnName}(${args}) {${newBody}${returnStmt}\n    }`;
});

fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'problemGenerator.js'), code);
console.log('Refactoring complete. Output saved to src/utils/problemGenerator.js');
