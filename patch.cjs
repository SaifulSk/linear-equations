const fs = require('fs');
let content = fs.readFileSync('src/utils/problemGenerator.js', 'utf-8');

const target = `    document.addEventListener('keypress', function(e) {
                correct = \`\${a*a}<i>x<sup>2</sup></i> \${2*a*b<0?'-':'+'} \${Math.abs(2*a*b)}<i>xy</i> + \${b*b}<i>y<sup>2</sup></i>\`;`;

const replacement = `    // ==========================================
    // MODULE: Expansions, Factorisation, Indices, Logarithms
    // ==========================================
    
    export function setupMCQ(correctStr, w1, w2, w3) {
        let options = [{str: correctStr, correct: true}, {str: w1, correct: false}, {str: w2, correct: false}, {str: w3, correct: false}];
        shuffleArray(options);
        return {
            ansIndex: options.findIndex(o => o.correct),
            options: options
        };
    }

    export function generateExpProblem(level) {
        let eqStr = "", steps = "", correct = "", w1 = "", w2 = "", w3 = "";
        
        if (level === 'standard') {
            if (Math.random() < 0.5) {
                // (ax + by)^2
                let a = getRandomInt(2, 5); let b = getRandomInt(-5, 5, true); if (Math.abs(b)===1) b=2;
                eqStr = \`(\${a}<i>x</i> \${b<0?'-':'+'} \${Math.abs(b)}<i>y</i>)<sup>2</sup>\`;
                correct = \`\${a*a}<i>x<sup>2</sup></i> \${2*a*b<0?'-':'+'} \${Math.abs(2*a*b)}<i>xy</i> + \${b*b}<i>y<sup>2</sup></i>\`;`;

content = content.replace(target, replacement);

fs.writeFileSync('src/utils/problemGenerator.js', content);
