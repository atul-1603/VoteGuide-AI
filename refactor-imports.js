const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /@\/env/g, to: "@/config" },
  { from: /@\/data\/timeline/g, to: "@/config/constants/timeline" },
  { from: /@\/data\/journey-steps/g, to: "@/config/constants/journey-steps" },
  { from: /@\/lib\/firebase/g, to: "@/services/firebase" },
  { from: /@\/lib\/gemini-server/g, to: "@/services/gemini-server" },
  { from: /@\/features\/shared\/hooks\/useCountdown/g, to: "@/lib/hooks/useCountdown" },
  { from: /@\/lib\/date-utils/g, to: "@/lib/utils/date-utils" },
  { from: /@\/lib\/api-client/g, to: "@/lib/utils/api-client" },
  { from: /@\/components\/ui\/[a-zA-Z0-9-]+/g, to: "@/components/ui" },
  { from: /@\/components\/layout\/[a-zA-Z0-9-]+/g, to: "@/components/layout" },
  { from: /@\/features\/auth\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/auth" },
  { from: /@\/features\/chat\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/chat" },
  { from: /@\/features\/home\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/home" },
  { from: /@\/features\/journey\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/journey" },
  { from: /@\/features\/map\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/map" },
  { from: /@\/features\/timeline\/(components|store|hooks|utils|services)\/[a-zA-Z0-9-]+/g, to: "@/features/timeline" }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('.');
