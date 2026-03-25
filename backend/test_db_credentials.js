import pkg from 'pg';
const { Client } = pkg;

const commonPasswords = [
  'postgres',
  'admin',
  'password',
  '123456',
  '1234',
  'root',
  '',
  '123'
];

async function testCredentials() {
  for (const password of commonPasswords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: password,
      database: 'postgres' // default DB often available
    });

    try {
      await client.connect();
      console.log(`SUCCESS: user=postgres password="${password}"`);
      await client.end();
      return;
    } catch (err) {
      console.log(`FAILED: user=postgres password="${password}" - err: ${err.message}`);
    }
  }
  console.log('ALL ATTEMPTS FAILED');
}

testCredentials();
