const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  })
  await browser.newPage()
  await browser.createIncognitoBrowserContext()
  await browser.createIncognitoBrowserContext()
  const contexts = browser.browserContexts()
  console.log('contexts:', contexts.length)
})()
