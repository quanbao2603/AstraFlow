// src/db/neo4j.ts
import neo4j from 'neo4j-driver';
import type { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const NEO4J_URI = process.env.NEO4J_URI!;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME!;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD!;

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
      throw new Error('[db/neo4j.ts] Neo4j env vars are not defined in .env');
    }
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
  }
  return driver;
}

export async function closeNeo4jDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('[Neo4j] Connection closed.');
  }
}
