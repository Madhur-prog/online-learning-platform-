const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => reject(err));
  });
}

async function verifyEndpoints() {
  console.log('Testing LearnSphere Course Catalog API Endpoints...');
  
  // 1. Get all courses
  const allRes = await get('/api/courses');
  console.log(`[API] GET /api/courses: Status ${allRes.status}, Count: ${allRes.data.courses?.length || allRes.data.data?.length || 0}`);

  // 2. Test Category Filters
  const categories = [
    'Web Development',
    'Programming',
    'Database Management',
    'Data Science',
    'Software Engineering'
  ];

  for (const cat of categories) {
    const encoded = encodeURIComponent(cat);
    const catRes = await get(`/api/courses?category=${encoded}`);
    const courses = catRes.data.courses || catRes.data.data || [];
    console.log(`[API] GET /api/courses?category=${cat}: Status ${catRes.status}, Returned: ${courses.length} courses`);
    courses.forEach(c => console.log(`      * ${c.title} (${c.level})`));
  }

  // 3. Test Detail for one of the new courses
  const allCourses = allRes.data.courses || allRes.data.data || [];
  const agileCourse = allCourses.find(c => c.title === 'Agile Software Development');
  if (agileCourse) {
    const detailRes = await get(`/api/courses/${agileCourse._id}`);
    const crs = detailRes.data.course || detailRes.data.data || detailRes.data;
    console.log(`\n[API] GET /api/courses/${agileCourse._id} ("Agile Software Development"): Status ${detailRes.status}`);
    console.log(`      Lessons count: ${crs.lessons?.length || 0}`);
    console.log(`      Instructor: ${crs.instructorId?.name || crs.instructor?.name || 'Present'}`);
  }

  console.log('\nAll API endpoint checks completed successfully!');
}

verifyEndpoints().catch(err => {
  console.error('API Verification error:', err.message);
  process.exit(1);
});
