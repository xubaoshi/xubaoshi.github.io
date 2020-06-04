const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  const page = await browser.newPage()
  await page.goto('http://www.baidu.com')
  await page.waitFor(5000)
  console.log('waitFor finished')
  await page.setViewport({
    width: 50,
    height: 50,
  })
  await page.waitForFunction('window.innerWidth < 100')
  console.log('waitForFunction finished')
})()
