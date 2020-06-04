const puppeteer = require('puppeteer')

let browserWSEndpoint = ''

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  browserWSEndpoint = browser.wsEndpoint()
  // 从Chromium断开和puppeteer的连接
  browser.disconnect()

  //直接连接已经存在的 Chrome
  const browser2 = await puppeteer.connect({ browserWSEndpoint })
  const page = await browser2.newPage()
  await page.goto('https://www.baidu.com')
})()
