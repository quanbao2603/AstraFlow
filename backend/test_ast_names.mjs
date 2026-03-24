import ts from 'typescript';
import fs from 'fs';

const filePath = 'd:/Code/AstraFlow/backend/src/controllers/story.controller.ts';
if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    process.exit(1);
}
const code = fs.readFileSync(filePath, 'utf-8');
const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.ES2022, true);

function visit(node) {
    console.log(`Visited: ${ts.SyntaxKind[node.kind]} | Text: ${node.getText().slice(0, 30).replace(/\n/g, ' ')}`);
    ts.forEachChild(node, visit);
}

console.log("Starting AST inspect for story.controller.ts...");
visit(sourceFile);
