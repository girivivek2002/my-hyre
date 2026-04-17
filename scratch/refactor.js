const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../app/recruiter'),
  path.join(__dirname, '../app/candidate')
];

function processFile(filePath) {
  // Skip layout and signup
  if (filePath.includes('layout.tsx') || filePath.includes('signup')) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Strip anything between `return (` and `<motion.div variants={containerVars}`
  const returnIdx = content.indexOf('return (');
  const containerVarsIdx = content.indexOf('<motion.div\\n          variants={containerVars}') !== -1 ? content.indexOf('<motion.div\\n          variants={containerVars}') : content.indexOf('<motion.div\\r\\n          variants={containerVars}') !== -1 ? content.indexOf('<motion.div\\r\\n          variants={containerVars}') : content.indexOf('<motion.div\\n'); // Fallbacks

  // The safest way is a regex matching precisely from `<div className="min-h-screen` to `<motion.div variants={containerVars}` or similar identifying block for the start of the scrollable content pane.

  // Let's use a regex to match the wrapper
  // We want to replace `<div className="min-h-screen ...` down to `className="flex-1 overflow-y-auto...` with just the `className="flex-1 overflow-y-auto...` wrapper,
  // EXCEPT some pages might not have `variants={containerVars}`.

  // Actively find the `<div className="min-h-screen` string.
  const mainDivMatch = content.match(/<div className="min-h-screen[^]*?{?\/\* Scrollable( Dashboard Area)? \*\/}?[^]*?(<motion\.div[^>]*className="[^"]*flex-1 overflow-y-auto[^>]*>)/);
  
  if (mainDivMatch) {
    console.log(`Refactoring Top: ${filePath}`);
    content = content.replace(mainDivMatch[0], mainDivMatch[2]);
    
    // Now remove the closing tags of the Main Content and Wrapper
    // Typically it's `</div>\n      </div>\n    </div>\n  );\n}` at the bottom.
    // Let's just find `</motion.div>\n      </div>\n    </div>\n  );\n}` or `</motion.div>\n</div>\n</div>`
    
    const closingMatch = content.match(/(<\/motion\.div>)\s*<\/div>\s*<\/div>\s*\);\s*}/);
    if (closingMatch) {
       content = content.replace(closingMatch[0], '$1\n  );\n}');
       console.log(`Refactored Bottom: ${filePath}`);
    } else {
       // fallback for pages that don't end exactly like that
       const altClosingMatch = content.match(/(<\/div>|<\/motion\.div>)\s*<\/div>\s*<\/div>\s*\);\s*}/);
       if (altClosingMatch) {
           content = content.replace(altClosingMatch[0], '$1\n  );\n}');
           console.log(`Refactored Bottom (alt): ${filePath}`);
       }
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    // Other files might have different structures, let's try a different regex
    const altMainDivMatch = content.match(/<div className="min-h-screen[^]*?{?\/\* Scrollable Area \*\/}?[^]*?(<motion\.div[^>]*className="flex-1 overflow-y-auto[^>]*>)/);
    if (altMainDivMatch) {
      console.log(`Refactoring Top (alt): ${filePath}`);
      content = content.replace(altMainDivMatch[0], altMainDivMatch[1]);
      const altClosingMatch = content.match(/(<\/motion\.div>)\s*<\/div>\s*<\/div>\s*\);\s*}/);
      if (altClosingMatch) {
         content = content.replace(altClosingMatch[0], '$1\n  );\n}');
      }
      fs.writeFileSync(filePath, content, 'utf8');
    } else {
       console.log(`Skipped (No match): ${filePath}`);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file === 'page.tsx') {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) walkDir(dir);
});
