const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  const page = await browser.newPage()
  await page.goto('https://www.baidu.com')
})()
