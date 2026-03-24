const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

async function test() {
  console.log('--- Testing User Creation ---');
  let user;
  try {
    const userRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'test@example.com', name: 'Test User' });
    console.log('Status:', userRes.status);
    console.log('User:', userRes.data);
    user = userRes.data;
  } catch (e) { console.error('Failed to create user:', e.message); return; }

  console.log('\n--- Testing StoryTemplate Creation ---');
  let template;
  try {
    const templateRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/story-templates',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { 
      title: 'Sci-Fi Adventure', 
      description: 'A journey through space',
      prompt: 'Write about a space explorer who finds a derelict ship',
      category: 'Sci-Fi',
      isPublic: true,
      userId: user.id
    });
    console.log('Status:', templateRes.status);
    console.log('Template:', templateRes.data);
    template = templateRes.data;
  } catch (e) { console.error('Failed to create template:', e.message); return; }

  console.log('\n--- Testing Story Creation ---');
  let story;
  try {
    const storyRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/stories',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { 
      title: 'The Derelict', 
      content: 'Captain Zara boarded the silent ship...',
      templateId: template.id,
      userId: user.id 
    });
    console.log('Status:', storyRes.status);
    console.log('Story:', storyRes.data);
    story = storyRes.data;
  } catch (e) { console.error('Failed to create story:', e.message); return; }

  console.log('\n--- Testing Get Stories by User ---');
  try {
    const listRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/stories/user/${user.id}`,
      method: 'GET'
    });
    console.log('Status:', listRes.status);
    console.log('Stories:', listRes.data);
  } catch (e) { console.error('Failed to get stories:', e.message); }
}

test();
