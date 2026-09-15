import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=process.cwd();
const require=createRequire(path.join(root,'spity/package.json'));
const {chromium,request}=require('@playwright/test');
const baseURL='http://127.0.0.1:3313';
const out=path.join(root,'docs/rncp/bloc-03/preuves/captures');
const dateParts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(part=>[part.type,part.value]));
const captureDate=`${dateParts.year}-${dateParts.month}-${dateParts.day}`;
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
  for(const [role,email,route,file] of [
    ['grimpeur','lina.demo@spity.local','/app/matching',`matching-${captureDate}.png`],
    ['grimpeur','lina.demo@spity.local','/app/places',`lieux-${captureDate}.png`],
    ['club','club.demo@spity.local','/app/events',`evenements-${captureDate}.png`]
  ]){
    const api=await request.newContext({baseURL,extraHTTPHeaders:{Origin:baseURL}});
    try {
      const login=await api.post('/api/auth/login',{data:{email,password:'SpityDemo2026!'}});assert.equal(login.status(),200);
      const context=await browser.newContext({storageState:await api.storageState(),viewport:{width:1440,height:1000},locale:'fr-FR',reducedMotion:'reduce'});
      try{
        const page=await context.newPage();await page.goto(baseURL+route,{waitUntil:'networkidle'});assert.equal(new URL(page.url()).pathname,route);await page.locator('main').waitFor({state:'visible'});
        if(route==='/app/matching'){
          await page.getByRole('searchbox',{name:'Nom ou localisation'}).fill('Nassim');
          await page.getByRole('heading',{name:'Nassim B.'}).waitFor({state:'visible'});
        }
        await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,file),animations:'disabled'});results.push({role,route,file,observedAt:new Date().toISOString(),nature:'Capture réelle de la base dédiée contenant uniquement les données de démonstration',...(route==='/app/matching'?{filter:'Recherche par nom : Nassim'}:{})});
      }finally{await context.close();}
    }finally{await api.dispose();}
  }
}finally{await browser.close();}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));
