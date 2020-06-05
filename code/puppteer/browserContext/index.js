const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  await browser.newPage()
  await browser.createIncognitoBrowserContext()
  await browser.createIncognitoBrowserContext()
  const contexts = browser.browserContexts()
  console.log('contexts:', contexts.length)
})()
