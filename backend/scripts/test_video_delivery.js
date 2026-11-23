const http = require('http');

async function testEndpoint(name, path, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method: 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk.toString('latin1'));
      res.on('end', () => {
        console.log(`[${name}]`);
        console.log(`  - Status: ${res.statusCode}`);
        console.log(`  - Content-Type: ${res.headers['content-type']}`);
        console.log(`  - Content-Range: ${res.headers['content-range'] || 'N/A'}`);
        console.log(`  - Content-Length: ${res.headers['content-length'] || 'N/A'}`);
        console.log(`  - Accept-Ranges: ${res.headers['accept-ranges'] || 'N/A'}`);
        console.log(`  - Bytes Received: ${data.length}`);
        resolve({ status: res.statusCode, headers: res.headers, len: data.length });
      });
    });
    req.on('error', err => {
      console.error(`[${name}] Error:`, err.message);
      resolve({ error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log('Testing Backend Video Delivery Endpoint Behavior:');
  console.log('--------------------------------------------------');
  await testEndpoint('TEST 1: 200 Full Content Request', '/uploads/videos/software-engineering-lesson.mp4');
  await testEndpoint('TEST 2: 206 Valid Partial Range Request (bytes=0-500)', '/uploads/videos/software-engineering-lesson.mp4', { Range: 'bytes=0-500' });
  await testEndpoint('TEST 3: 416 Invalid Range Request (bytes=9999999-9999999)', '/uploads/videos/software-engineering-lesson.mp4', { Range: 'bytes=9999999-9999999' });
  await testEndpoint('TEST 4: 404 Missing File Request', '/uploads/videos/non-existent-lesson.mp4');
  await testEndpoint('TEST 5: Path Traversal Protection Check', '/uploads/videos/..%2F..%2Fpackage.json');
  await testEndpoint('TEST 6: Dedicated Stream Route /api/videos/stream/:filename', '/api/videos/stream/software-engineering-lesson.mp4', { Range: 'bytes=0-1024' });
  console.log('--------------------------------------------------');
}

run();
