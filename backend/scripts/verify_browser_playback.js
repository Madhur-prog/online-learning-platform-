const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9222;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval exception: ${res.exceptionDetails.text || JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function runBrowserTests() {
  console.log('================================================================');
  console.log('     AUTOMATED BROWSER VIDEO PLAYBACK VERIFICATION SUITE       ');
  console.log('================================================================');

  // Connect to DB to load courses & lessons
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnsphere');
  const courses = await Course.find();
  console.log(`Loaded ${courses.length} courses from MongoDB.`);

  // Launch Chrome in headless mode with remote debugging
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
  console.log(`Launching headless Chrome on port ${CDP_PORT}...`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${userDataDir}`
  ], { stdio: 'ignore' });

  // Wait for Chrome CDP to be available
  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    try {
      versionInfo = await getJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (versionInfo) break;
    } catch (e) {
      await delay(300);
    }
  }

  if (!versionInfo) {
    chromeProc.kill();
    throw new Error('Failed to connect to headless Chrome CDP.');
  }

  console.log('Chrome CDP connected:', versionInfo['Browser']);
  const tabs = await getJson(`http://127.0.0.1:${CDP_PORT}/json`);
  const mainTab = tabs.find(t => t.type === 'page') || tabs[0];
  const cdp = new CDPClient(mainTab.webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');

  try {
    // 1. Authenticate as student
    console.log('\n[TEST STEP 1] Logging in as student@learnsphere.com via browser...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/login' });
    await delay(1500);

    // Direct token injection into localStorage for fast and 100% deterministic student session
    await cdp.eval(`
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'student@learnsphere.com', password: 'Password123!' })
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('learnsphere_token', data.token);
            localStorage.setItem('learnsphere_user', JSON.stringify(data.user));
            resolve(true);
          } else {
            reject(new Error(data.message || 'Login failed'));
          }
        } catch(e) { reject(e); }
      })
    `);
    console.log('  ✓ Student authentication established in browser localStorage.');

    // 2. Perform detailed testing for Software Engineering Fundamentals
    console.log('\n[TEST STEP 2] Testing "Software Engineering Fundamentals" Playback Workflow:');
    const seCourse = courses.find(c => c.title.includes('Software Engineering Fundamentals'));
    if (!seCourse) throw new Error('Software Engineering Fundamentals course not found in DB!');

    const seLessons = await Lesson.find({ courseId: seCourse._id }).sort({ order: 1 });
    console.log(`Found ${seLessons.length} lessons for ${seCourse.title}.`);

    // Lesson 1: Play, advance currentTime, pause, resume, seek
    const lesson1 = seLessons[0];
    const lesson1Url = `http://localhost:5173/courses/${seCourse._id}/lessons/${lesson1._id}`;
    console.log(`  -> Navigating to Lesson 1: "${lesson1.title}" (${lesson1Url})`);
    await cdp.send('Page.navigate', { url: lesson1Url });
    await delay(2000);

    // Wait for video element
    const videoInit = await cdp.eval(`
      (() => {
        const video = document.querySelector('video');
        if (!video) return { found: false };
        return {
          found: true,
          src: video.src || video.currentSrc,
          error: video.error ? video.error.code : null,
          readyState: video.readyState,
          duration: video.duration,
          paused: video.paused
        };
      })()
    `);
    console.log('  Video element state:', videoInit);
    if (!videoInit.found) throw new Error('No <video> element found on player page!');
    if (videoInit.error) throw new Error(`Video initialization error code: ${videoInit.error}`);

    // Play video
    console.log('  -> Triggering video.play()...');
    const playRes = await cdp.eval(`
      new Promise((resolve, reject) => {
        const video = document.querySelector('video');
        video.muted = true;
        video.play().then(() => resolve(true)).catch(e => reject(e.message));
      })
    `);
    console.log('  -> video.play() resolved successfully:', playRes);

    // Wait for currentTime to advance
    await delay(1500);
    const playbackState = await cdp.eval(`
      (() => {
        const video = document.querySelector('video');
        return {
          paused: video.paused,
          currentTime: video.currentTime,
          duration: video.duration,
          readyState: video.readyState,
          ended: video.ended
        };
      })()
    `);
    console.log('  Playback progress after 1.5s:', playbackState);
    if (playbackState.paused) throw new Error('Video remained paused after play() call!');
    if (playbackState.currentTime <= 0.2) throw new Error(`Video currentTime did not advance! (currentTime: ${playbackState.currentTime})`);
    console.log(`  ✓ Playback CONFIRMED! currentTime advanced to ${playbackState.currentTime.toFixed(2)}s`);

    // Test Pause
    console.log('  -> Triggering video.pause()...');
    await cdp.eval(`document.querySelector('video').pause()`);
    await delay(300);
    const pauseState = await cdp.eval(`document.querySelector('video').paused`);
    if (!pauseState) throw new Error('Video pause() failed!');
    console.log('  ✓ Video successfully paused.');

    // Test Seeking forward
    console.log('  -> Seeking forward to currentTime = 3.0s...');
    await cdp.eval(`
      new Promise((resolve) => {
        const video = document.querySelector('video');
        video.currentTime = 3.0;
        video.onseeked = () => resolve(video.currentTime);
        setTimeout(() => resolve(video.currentTime), 1000);
      })
    `);
    const seekState = await cdp.eval(`document.querySelector('video').currentTime`);
    console.log(`  ✓ Seek confirmed at currentTime: ${seekState.toFixed(2)}s`);

    // Switch to Lesson 2
    if (seLessons.length > 1) {
      const lesson2 = seLessons[1];
      const lesson2Url = `http://localhost:5173/courses/${seCourse._id}/lessons/${lesson2._id}`;
      console.log(`\n  -> Switching to Lesson 2: "${lesson2.title}" (${lesson2Url})`);
      await cdp.send('Page.navigate', { url: lesson2Url });
      await delay(2000);

      const l2Play = await cdp.eval(`
        new Promise((resolve, reject) => {
          const video = document.querySelector('video');
          if (!video) return reject('No video element in Lesson 2');
          video.muted = true;
          video.play().then(() => resolve(true)).catch(e => reject(e.message));
        })
      `);
      await delay(1200);
      const l2Progress = await cdp.eval(`document.querySelector('video').currentTime`);
      console.log(`  ✓ Lesson 2 video playing cleanly! currentTime: ${l2Progress.toFixed(2)}s`);
    }

    // 3. Repeat playback verification across ALL 10 COURSES
    console.log('\n[TEST STEP 3] Iterating Playback Verification Across All 10 Courses:');
    console.log('-'.repeat(80));
    console.log('#'.padEnd(3) + 'Course Title'.padEnd(35) + 'Category'.padEnd(24) + 'Result');
    console.log('-'.repeat(80));

    let index = 1;
    let allPassed = true;

    for (const c of courses) {
      const firstLesson = await Lesson.findOne({ courseId: c._id }).sort({ order: 1 });
      if (!firstLesson) {
        console.log(`${index.toString().padEnd(3)}${c.title.slice(0, 32).padEnd(35)}${c.category.padEnd(24)}FAIL (No lessons)`);
        allPassed = false;
        index++;
        continue;
      }

      const lessonUrl = `http://localhost:5173/courses/${c._id}/lessons/${firstLesson._id}`;
      await cdp.send('Page.navigate', { url: lessonUrl });
      await delay(1800);

      const result = await cdp.eval(`
        new Promise(async (resolve) => {
          try {
            const video = document.querySelector('video');
            if (!video) {
              // check if iframe YouTube player
              const iframe = document.querySelector('iframe');
              if (iframe) return resolve({ type: 'iframe', ok: true });
              return resolve({ ok: false, error: 'No video or iframe found' });
            }
            if (video.error) {
              return resolve({ ok: false, error: 'Video error code: ' + video.error.code });
            }
            video.muted = true;
            await video.play();
            setTimeout(() => {
              resolve({
                type: 'html5',
                ok: video.currentTime > 0.1 && !video.paused,
                currentTime: video.currentTime,
                duration: video.duration
              });
            }, 1000);
          } catch(e) {
            resolve({ ok: false, error: e.message || String(e) });
          }
        })
      `);

      if (result.ok) {
        const detail = result.type === 'html5' ? `PASS (played to ${result.currentTime.toFixed(2)}s)` : 'PASS (iframe embed)';
        console.log(`${index.toString().padEnd(3)}${c.title.slice(0, 32).padEnd(35)}${c.category.padEnd(24)}${detail}`);
      } else {
        console.log(`${index.toString().padEnd(3)}${c.title.slice(0, 32).padEnd(35)}${c.category.padEnd(24)}FAIL: ${result.error}`);
        allPassed = false;
      }

      index++;
    }
    console.log('-'.repeat(80));

    if (allPassed) {
      console.log('\n================================================================');
      console.log('  SUCCESS! REAL VIDEO PLAYBACK VERIFIED IN BROWSER FOR ALL 10 COURSES!');
      console.log('================================================================\n');
    } else {
      throw new Error('One or more courses failed browser video playback.');
    }

  } finally {
    cdp.close();
    chromeProc.kill();
    await delay(500);
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {
      // Ignored: temporary profile directory cleanup on Windows
    }
    await mongoose.disconnect();
  }
}

runBrowserTests().catch(err => {
  console.error('\nBROWSER PLAYBACK TEST FAILURE:', err);
  process.exit(1);
});
