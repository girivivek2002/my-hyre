const fs = require('fs');

const files = [
  'app/recruiter/schedule/page.tsx', 
  'app/recruiter/profile/page.tsx', 
  'app/recruiter/settings/page.tsx', 
  'app/candidate/jobs/page.tsx', 
  'app/candidate/interviews/page.tsx', 
  'app/candidate/profile/page.tsx', 
  'app/candidate/settings/page.tsx',
  'app/admin/dashboard/page.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
      console.log('Skipping missing file', f);
      return;
  }
  let lines = fs.readFileSync(f, 'utf8').split('\n');
  
  let start = lines.findIndex(l => l.includes('<div className="min-h-screen'));
  
  // Find where the topbar ends realistically... it's right after <ChevronDown...
  let end = lines.findIndex(l => l.includes('<ChevronDown'));
  
  if (start !== -1 && end !== -1) {
     console.log(f, 'Start:', start, 'End:', end);
     
     // The topbar div closes 2 lines after ChevronDown usually:
     //             <ChevronDown size={16} />
     //         </div>
     //     </div>
     // </motion.div>
     let actualEnd = end + 3; 

     // Remove Top
     lines.splice(start, actualEnd - start + 1);

     // Remove bottom 2 divs `</div> </div> );`
     let returnIdx = lines.length - 1;
     while(returnIdx >= 0 && !lines[returnIdx].includes(');')) {
       returnIdx--;
     }
     if(returnIdx >= 2) {
       lines.splice(returnIdx - 2, 2);
     }

     fs.writeFileSync(f, lines.join('\n'));
     console.log('Fixed', f);
  } else {
     console.log('Failed to find bounds in', f, start, end);
  }
});
