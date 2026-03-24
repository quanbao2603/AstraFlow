import ts from 'typescript';
import fs from 'fs';
import path from 'path';

// Helper to get all ts/js files
function getFiles(dir, files_ = []) {
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            if (!name.includes('node_modules') && !name.includes('dist')) {
                getFiles(name, files_);
            }
        } else {
            if (name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.tsx') || name.endsWith('.jsx')) {
                files_.push(name);
            }
        }
    }
    return files_;
}

// Escaping strings for Cypher
function escapeCypher(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'");
}

function parseFile(absoluteFilePath, projectRoot) {
    const relativePath = path.relative(projectRoot, absoluteFilePath).replace(/\\/g, '/');
    const code = fs.readFileSync(absoluteFilePath, 'utf-8');
    const sourceFile = ts.createSourceFile(absoluteFilePath, code, ts.ScriptTarget.ES2022, true);

    const statements = [];

    function visit(node) {
        // 1. Files
        statements.push(`MERGE (f:File {path: '${escapeCypher(relativePath)}'})`);

        // 2. Class Declaration
        if (ts.isClassDeclaration(node)) {
            const className = node.name ? node.name.text : 'Anonymous';
            const escapedClass = escapeCypher(className);
            statements.push(`MERGE (c:Class {name: '${escapedClass}', path: '${escapeCypher(relativePath)}'})`);
            statements.push(`MATCH (f:File {path: '${escapeCypher(relativePath)}'}), (c:Class {name: '${escapedClass}', path: '${escapeCypher(relativePath)}'}) MERGE (f)-[:DECLARES]->(c)`);

            // Members
            node.members.forEach(member => {
                if (ts.isMethodDeclaration(member)) {
                    const methodName = member.name.getText();
                    const escapedMethod = escapeCypher(methodName);
                    statements.push(`MERGE (m:Method {name: '${escapedMethod}', path: '${escapeCypher(relativePath)}'})`);
                    statements.push(`MATCH (c:Class {name: '${escapedClass}', path: '${escapeCypher(relativePath)}'}), (m:Method {name: '${escapedMethod}', path: '${escapeCypher(relativePath)}'}) MERGE (c)-[:DECLARES]->(m)`);
                }
            });
        }

        // 3. Function Declaration
        if (ts.isFunctionDeclaration(node)) {
            const funcName = node.name ? node.name.text : 'Anonymous';
            const escapedFunc = escapeCypher(funcName);
            statements.push(`MERGE (fnc:Function {name: '${escapedFunc}', path: '${escapeCypher(relativePath)}'})`);
            statements.push(`MATCH (f:File {path: '${escapeCypher(relativePath)}'}), (fnc:Function {name: '${escapedFunc}', path: '${escapeCypher(relativePath)}'}) MERGE (f)-[:DECLARES]->(fnc)`);
        }

        // 3.1 Arrow Functions in Variable Declarations
        if (ts.isVariableDeclaration(node) && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
            const funcName = node.name ? node.name.getText() : 'Anonymous';
            const escapedFunc = escapeCypher(funcName);
            statements.push(`MERGE (fnc:Function {name: '${escapedFunc}', path: '${escapeCypher(relativePath)}'})`);
            statements.push(`MATCH (f:File {path: '${escapeCypher(relativePath)}'}), (fnc:Function {name: '${escapedFunc}', path: '${escapeCypher(relativePath)}'}) MERGE (f)-[:DECLARES]->(fnc)`);
        }

        // 4. TS Interface / Types
        if (ts.isInterfaceDeclaration(node)) {
            const intName = node.name.text;
            statements.push(`MERGE (i:Interface {name: '${escapeCypher(intName)}', path: '${escapeCypher(relativePath)}'})`);
        }

        // 5. Calls (Roughly)
        if (ts.isCallExpression(node)) {
            const caller = node.expression.getText();
            if (caller && caller.match(/^[a-zA-Z0-9_\.]+$/)) {
                // Statements linking calls to approximate targets - we will flag them as identifiers
                const cleanCaller = escapeCypher(caller.split('.').pop());
                statements.push(`MERGE (ic:IdentifierCall {name: '${cleanCaller}', path: '${escapeCypher(relativePath)}'})`);
                statements.push(`MATCH (f:File {path: '${escapeCypher(relativePath)}'}), (ic:IdentifierCall {name: '${cleanCaller}', path: '${escapeCypher(relativePath)}'}) MERGE (f)-[:CALLS_IDENTIFIER]->(ic)`);
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return statements;
}

const targetDirs = [
    'd:/Code/AstraFlow/backend/src',
    'd:/Code/AstraFlow/frontend/src'
];
const projectRoot = 'd:/Code/AstraFlow';

let allStatements = [];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = getFiles(dir);
        files.forEach(file => {
            console.log(`Parsing ${file}...`);
            const fileStatements = parseFile(file, projectRoot);
            allStatements = allStatements.concat(fileStatements);
        });
    }
});

const outputPath = 'C:/Users/Administrator/.gemini/antigravity/brain/928e8a61-997e-4b26-bb73-f78b4eb95a74/ast_graph_batch.cypher';

// Deduplicate statements to prevent stack overflows on Merge repetitions
const uniqueStatements = [...new Set(allStatements)];

fs.writeFileSync(outputPath, uniqueStatements.join('\n'));
console.log(`Saved ${uniqueStatements.length} Cypher statements to ${outputPath}`);
