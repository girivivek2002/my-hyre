const fs = require('fs');
const path = require('path');

const jobs = [
  { file: 'app/recruiter/analytics/page.tsx', start: 125, end: 197 },
  { file: 'app/recruiter/analytics/page.tsx', stripBottom: true }
];

jobs.forEach(job => {
  const filePath = path.join(__dirname, '../', job.file);
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');

  if (job.stripBottom) {
    let returnIdx = lines.length - 1;
    while(returnIdx >= 0 && !lines[returnIdx].includes(');')) {
      returnIdx--;
    }
    // Remove the two divs above it
    lines.splice(returnIdx - 2, 2);
  } else {
    lines.splice(job.start - 1, job.end - job.start + 1);
  }

  fs.writeFileSync(filePath, lines.join('\n'));
});
console.log('Done mapping lines for analytics');
