import fs from 'fs';

try {
  await import('./src/index.js');
} catch (e) {
  const errorDetails = `
--- FULL CRASH ERROR ---
Message: ${e.message}
Stack: ${e.stack}
Details: ${JSON.stringify(e, null, 2)}
-----------------------
`;
  fs.writeFileSync('error.log', errorDetails);
  console.log('Error written to error.log');
}
