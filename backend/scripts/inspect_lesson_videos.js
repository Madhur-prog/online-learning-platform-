const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnsphere');
  const courses = await Course.find();
  for (const c of courses) {
    const lessons = await Lesson.find({ courseId: c._id }).sort({ order: 1 });
    console.log(`Course [${c.category}]: "${c.title}"`);
    lessons.forEach(l => {
      console.log(`   #${l.order} ${l.title} -> ${l.videoUrl}`);
    });
  }
  await mongoose.disconnect();
}
check();
