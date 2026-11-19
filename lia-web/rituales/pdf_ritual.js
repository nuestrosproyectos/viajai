// Uso: node pdf_ritual.js PLANTILLA.html SALIDA.pdf [CARPETA_CAPTURAS]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [html, pdf, caps] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file://' + path.resolve(html)); await p.waitForTimeout(800);
  await p.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
  if (caps) { const n = await p.locator('.pag').count(); for (let i = 0; i < n; i++) await p.locator('.pag').nth(i).screenshot({ path: path.join(caps, `pag${i + 1}.png`) }); }
  await b.close();
})();
