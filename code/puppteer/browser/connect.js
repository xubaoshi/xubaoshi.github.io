const puppeteer = require('puppeteer')

let browserWSEndpoint = ''

;(async () => {
  const options = {
    headless: false,
    slowMo: 100,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  }
  const browser = await puppeteer.launch({
    ...options,
  })
  browserWSEndpoint = browser.wsEndpoint()
  // 从Chromium断开和puppeteer的连接
  browser.disconnect()

  //直接连接已经存在的 Chrome
  const browser2 = await puppeteer.connect({
    ...options,
    browserWSEndpoint,
  })
  const page = await browser2.newPage()
  await page.goto('https://www.baidu.com')
})()
