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
  page.goto('http://www.baidu.com')

  await page.waitForRequest(
    'https://www.baidu.com/img/flexible/logo/pc/result.png'
  )
  console.log('request loaded')

  await page.waitForResponse(
    'https://www.baidu.com/img/flexible/logo/pc/result.png'
  )
  console.log('respone loaded')

  await page.waitForXPath('//img')
  console.log('image loaded')

  await page.waitForSelector('[href="http://xueshu.baidu.com"]')
  console.log('selector loaded')
})()
