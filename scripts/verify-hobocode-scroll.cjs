// Optional browser regression: PLAYWRIGHT_MODULE, CHROMIUM_EXECUTABLE,
// WEBKIT_EXECUTABLE, BASE_URL and EVIDENCE_DIR can override local defaults.
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:8765';
const routes = ['/hobocode/', '/ko/hobocode/', '/ja/hobocode/', '/zh-hans/hobocode/'];
(async () => {
  let cases = 0;
  for (const [name, engine] of Object.entries({ chromium, webkit })) {
    const browser = await engine.launch({ headless: true, executablePath: process.env[`${name.toUpperCase()}_EXECUTABLE`] || undefined });
    try {
      for (const width of [375, 390, 430, 1280]) {
        for (const route of routes) {
          for (const reducedMotion of ['no-preference', 'reduce']) {
            const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 760, hasTouch: width < 760, reducedMotion });
            try {
              const page = await context.newPage();
              await page.goto(base + route);
              await page.evaluate(() => document.fonts.ready);
              await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
              await page.locator('.screen-list').scrollIntoViewIfNeeded();
              if (width >= 760) await page.waitForTimeout(1200); // settle staggered reveal transforms
              const layout = await page.evaluate(() => {
                const list = document.querySelector('.screen-list');
                const cards = [...list.children].map(e => e.getBoundingClientRect().toJSON());
                list.scrollLeft = 100;
                return { pageWidth: document.documentElement.scrollWidth, viewport: innerWidth,
                  listWidth: list.clientWidth, listScroll: list.scrollWidth, left: list.scrollLeft,
                  snap: getComputedStyle(list).scrollSnapType, cards };
              });
              assert.ok(layout.pageWidth <= layout.viewport, `${name} ${width} ${route}: page overflow`);
              assert.ok(layout.listScroll <= layout.listWidth, 'nested horizontal overflow');
              assert.equal(layout.left, 0);
              assert.equal(layout.snap, 'none');
              assert.equal(layout.cards.length, 3);
              for (let i = 1; i < 3; i++) {
                if (width < 760) assert.ok(layout.cards[i].top >= layout.cards[i - 1].bottom, 'cards must stack');
                else assert.ok(Math.abs(layout.cards[i].top - layout.cards[0].top) < 1, 'desktop cards must share row');
              }
              // Traverse the page through the sticky arrival sequence, checking horizontal containment.
              for (const progress of [0, 0.5, 1]) {
                await page.evaluate(progress => {
                  const section = document.querySelector('.arrive');
                  scrollTo(0, section.getBoundingClientRect().top + scrollY + progress * (section.offsetHeight - innerHeight));
                }, progress);
                await page.waitForTimeout(60);
                assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
                if (reducedMotion === 'no-preference') assert.equal(await page.locator('.arrive').getAttribute('data-step'), String(progress * 2));
              }
              if (name === 'chromium' && width === 390 && route === '/ko/hobocode/' && reducedMotion === 'no-preference') {
                await page.evaluate(() => { const e = document.querySelector('.screen-list'); scrollTo(0, e.getBoundingClientRect().top + scrollY - 140); });
                await page.waitForTimeout(100);
                const before = await page.evaluate(() => scrollY);
                const cdp = await context.newCDPSession(page);
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: 600 }] });
                for (let i = 1; i <= 12; i++) {
                  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 290 - i * 9, y: 600 - i * 20 }] });
                  await page.waitForTimeout(16);
                }
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
                await page.waitForTimeout(300);
                assert.ok(await page.evaluate(() => scrollY) > before + 80, 'diagonal touch must move page vertically');
                assert.equal(await page.locator('.screen-list').evaluate(e => e.scrollLeft), 0);
              }
              if (process.env.EVIDENCE_DIR && route === '/ko/hobocode/' && reducedMotion === 'no-preference') {
                fs.mkdirSync(process.env.EVIDENCE_DIR, { recursive: true });
                await page.evaluate(() => { const e = document.querySelector('.screens'); scrollTo(0, e.offsetTop); });
                await page.waitForTimeout(800);
                await page.screenshot({ path: `${process.env.EVIDENCE_DIR}/${name}-${width}-after.png` });
              }
              cases++;
            } finally { await context.close(); }
          }
        }
      }
    } finally { await browser.close(); }
  }
  console.log(`PASS: ${cases} browser/viewport/locale/motion cases; Chromium diagonal touch; sticky stages; desktop layout.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
