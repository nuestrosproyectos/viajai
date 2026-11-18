const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + __dirname + '/ritual.html'); await p.waitForTimeout(800);
  await p.pdf({ path: __dirname + '/Ritual luna llena 24 nov - Ines (muestra).pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await p.setViewportSize({ width: 794, height: 1123 });
  for (let i = 0; i < 4; i++) { await p.evaluate(i => document.querySelectorAll('.pag')[i].scrollIntoView(), i); await p.locator('.pag').nth(i).screenshot({ path: __dirname + `/pag${i+1}.png` }); }
  await b.close();
})();
