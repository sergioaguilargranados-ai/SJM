const fs=require('fs');
const pages = ['mundo-infantil', 'sanacion-interior', 'matrimonios', 'jovenes'];
pages.forEach(p => {
  const f = 'g:/Otros ordenadores/Mi PC/SJM/sjm-platform/src/app/(public)/' + p + '/page.tsx';
  if(fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(/id=\{sec-\}/g, 'id={`sec-${idx}`}');
    fs.writeFileSync(f, text);
    console.log("Updated", f);
  }
});
