const fs = require('fs');

let content = fs.readFileSync('src/pages/Directory.tsx', 'utf8');

// Replace Settings with X in imports if needed
if (!content.includes('X,') && !content.includes(', X') && !content.includes('{ X ')) {
  content = content.replace('Settings, MessageSquare', 'Settings, MessageSquare, X');
}

// Replace Settings icon in the close button with X and remove comment
content = content.replace(
  '<Settings className="w-4 h-4" /> {/* Or just text \'x\' if X is not imported */}',
  '<X className="w-4 h-4" />'
);

fs.writeFileSync('src/pages/Directory.tsx', content, 'utf8');
