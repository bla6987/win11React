// Original geometric artwork for this fork, dedicated under CC0-1.0.
// No traced vendor logos, screenshots, photos, or proprietary font glyphs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, basename } from 'node:path';
const paths = JSON.parse(readFileSync(new URL('./asset-paths.json', import.meta.url)));
const shapes = {
 folder: '<path d="M5 15V9h18l6 6h30v37H5z" fill="#dba23c"/><path d="M5 21h54l-4 31H9z" fill="#f7c65b"/>',
 file: '<path d="M15 5h23l12 13v41H15z" fill="#fff" stroke="#547899" stroke-width="2"/><path d="M38 5v14h12M23 29h19M23 36h19M23 43h13" fill="none" stroke="#547899" stroke-width="2"/>',
 bin: '<path d="M18 17l4 41h24l4-41M13 17h42M25 12V6h17v6" fill="none" stroke="#386f89" stroke-width="4" stroke-linejoin="round"/><path d="M28 25v24M39 25v24" stroke="#386f89" stroke-width="3"/>',
 user: '<circle cx="32" cy="32" r="30" fill="#d7eaf3"/><circle cx="32" cy="23" r="10" fill="#547d99"/><path d="M12 55c0-24 40-24 40 0" fill="#547d99"/>',
 pc: '<rect x="5" y="9" width="54" height="35" rx="4" fill="#4d85a0"/><path d="M9 13h46v27H9z" fill="#d8f1fa"/><path d="M32 44v10M20 55h24" stroke="#4d85a0" stroke-width="4"/>',
 search: '<circle cx="26" cy="26" r="17"/><path d="M39 39l18 18"/>',
 close: '<path d="M16 16l32 32M48 16L16 48"/>',
 minus: '<path d="M13 32h38"/>',
 plus: '<path d="M13 32h38M32 13v38"/>',
 copy: '<rect x="11" y="8" width="30" height="37" rx="3"/><rect x="22" y="19" width="30" height="37" rx="3" fill="#e5f2fa"/>',
 cut: '<circle cx="17" cy="45" r="8"/><circle cx="47" cy="45" r="8"/><path d="M21 39L49 9M43 39L15 9"/>',
 paste: '<rect x="13" y="12" width="38" height="46" rx="4"/><rect x="23" y="6" width="18" height="12" rx="3" fill="#d5ebf5"/>',
 settings: '<circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="4"/><path d="M32 5v8M32 51v8M5 32h8M51 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6"/>',
 arrow: '<path d="M40 12L20 32l20 20"/>',
 globe: '<circle cx="32" cy="32" r="26"/><ellipse cx="32" cy="32" rx="12" ry="26"/><path d="M7 25h50M7 39h50"/>',
 wifi: '<path d="M5 21q27-24 54 0M15 32q17-15 34 0M25 43q7-7 14 0"/><circle cx="32" cy="53" r="2"/>',
 sound: '<path d="M8 25h10l15-13v40L18 39H8zM42 22q13 10 0 20M49 13q23 19 0 38"/>',
 home: '<path d="M7 29L32 8l25 21M14 25v32h13V39h10v18h13V25"/>',
 image: '<rect x="5" y="9" width="54" height="45" rx="4"/><circle cx="43" cy="22" r="5"/><path d="M8 49l17-21 12 14 8-9 11 16"/>',
 disk: '<rect x="5" y="17" width="54" height="30" rx="5" fill="#c9d9e1"/><path d="M9 37h46"/><circle cx="48" cy="42" r="2"/>',
};
function icon(name) {
 const n=name.toLowerCase(); let kind='file';
 if (/bin|trash|delete/.test(n)) kind='bin';
 else if (/folder|explorer|docs|down|music|vid|pics|desk|onedrive|^user-sm/.test(n)) kind='folder';
 else if (/prof|account|user|people/.test(n)) kind='user';
 else if (/wall|display|system|thispc|monitor/.test(n)) kind='pc';
 else if (/search/.test(n)) kind='search';
 else if (/close|cross/.test(n)) kind='close';
 else if (/minimize/.test(n)) kind='minus';
 else if (/new|plus/.test(n)) kind='plus';
 else if (/copy/.test(n)) kind='copy'; else if (/cut/.test(n)) kind='cut'; else if (/paste/.test(n)) kind='paste';
 else if (/setting|personal|gear/.test(n)) kind='settings';
 else if (/chev|arrow|back/.test(n)) kind='arrow';
 else if (/edge|browser|network/.test(n)) kind='globe';
 else if (/wifi/.test(n)) kind='wifi'; else if (/audio|volume/.test(n)) kind='sound';
 else if (/home|bootlogo|logo|favicon/.test(n)) kind='home';
 else if (/photo|picture|image/.test(n)) kind='image';
 else if (/disc|disk|drive/.test(n)) kind='disk';
 let body=shapes[kind];
 if (n==='bin1') body += '<path d="M24 25l7-5 7 5 5-3" fill="none" stroke="#549e71" stroke-width="3"/>';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#305b74" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`;
}
function wallpaper(path) {
 const dark=path.includes('/dark/'); const bg=dark?'#123046':'#c7e5ee';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="${bg}"/><path d="M0 700Q400 100 900 530T1600 350V1000H0z" fill="#75aabd"/><path d="M0 800Q600 300 1050 720T1600 490V1000H0z" fill="#49859c"/><path d="M0 900Q750 540 1180 840T1600 690V1000H0z" fill="#2b607b"/></svg>\n`;
}
for (const path of paths) {
 mkdirSync(dirname(path),{recursive:true});
 writeFileSync(path,path.includes('/wallpaper/')?wallpaper(path):icon(basename(path,'.svg')));
}
