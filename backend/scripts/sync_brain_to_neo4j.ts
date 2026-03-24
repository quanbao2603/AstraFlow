import neo4j from 'neo4j-driver';
import * as fs from 'fs';
import * as path from 'path';

// Cấu hình Neo4j (Đọc từ dotenv nếu có, hoặc fallback default)
const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
const brainDir = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain';

async function syncBrainToNeo4j() {
  const session = driver.session();
  try {
    console.log('--- 🧠 KHỞI CHẠY AUTO BACKUP BRAIN CONTEXT ---');

    // 1. Quét tìm thư mục Brain gần nhất hoặc cụ thể
    if (!fs.existsSync(brainDir)) {
      throw new Error(`Directory ${brainDir} does not exist.`);
    }

    const folders = fs.readdirSync(brainDir).filter(f => fs.statSync(path.join(brainDir, f)).isDirectory());
    if (folders.length === 0) {
      console.log('Không tìm thấy dữ liệu brain nào.');
      return;
    }

    // Chọn Folder gần nhất (Dựa trên mtime)
    const sortedFolders = folders.map(f => ({
      name: f,
      time: fs.statSync(path.join(brainDir, f)).mtime.getTime()
    })).sort((a, b) => b.time - a.time);

    const latestSession = sortedFolders[0]?.name;
    if (!latestSession) {
      console.log('Không tìm thấy phiên đối thoại hợp lệ.');
      return;
    }
    const sessionPath = path.join(brainDir, latestSession);
    console.log(`Đang quét phiên đối thoại: ${latestSession}`);

    // Read task.md / walkthrough.md
    let taskContent = '';
    const taskPath = path.join(sessionPath, 'task.md');
    if (fs.existsSync(taskPath)) {
      taskContent = fs.readFileSync(taskPath, 'utf-8');
    }

    // 2. Chạy mã Cypher đẩy Node
    console.log('Đang đẩy lên Graph Neo4j...');
    const cypher = `
      MERGE (c:Conversation {id: $id})
      ON CREATE SET c.createdAt = datetime(), c.syncAt = datetime()
      ON MATCH SET c.syncAt = datetime()
      
      MERGE (p:Project {name: "AstraFlow"})
      MERGE (p)-[:HAS_CONVERSATION]->(c)

      // Cập nhật nội dung tóm tắt
      SET c.notes = $notes
      RETURN c
    `;

    const result = await session.run(cypher, {
      id: latestSession,
      notes: taskContent.substring(0, 5000)
    });

    console.log('✅ Đồng bộ node Conversation thành công!');
    if (result.records[0]) {
      console.log(result.records[0].get('c').properties);
    }


  } catch (error) {
    console.error('❌ Lỗi Auto Backup:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

syncBrainToNeo4j();
