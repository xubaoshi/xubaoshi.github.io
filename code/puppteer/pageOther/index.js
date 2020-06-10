const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    headless: false,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
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
