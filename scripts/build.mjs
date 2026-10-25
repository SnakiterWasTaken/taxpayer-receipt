import {cp,mkdir,rm,access} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const dest=join(root,'dist');
await rm(dest,{recursive:true,force:true});
await mkdir(join(dest,'src'),{recursive:true});
for(const name of ['index.html','styles.css','assets','src','docs','README.md','ROADMAP.md','LICENSE']) await cp(join(root,name),join(dest,name),{recursive:true});
try {
  await access(join(root,'data','eu-spending.json'));
  await mkdir(join(dest,'data'),{recursive:true});
  await cp(join(root,'data','eu-spending.json'),join(dest,'data','eu-spending.json'));
}
catch{console.warn('No prebuilt Eurostat snapshot: browser will fetch directly from Eurostat until data refresh is run.');}
try {
 await access(join(root,'data','economic-context.json'));
 await mkdir(join(dest,'data'),{recursive:true});
 await cp(join(root,'data','economic-context.json'),join(dest,'data','economic-context.json'));
} catch {console.warn('Economic context snapshot unavailable; historical context will display as unavailable.');}
console.log(`Static site built at ${dest}`);
