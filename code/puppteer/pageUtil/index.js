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
  await page.goto('http://www.baidu.com', {
    // timeout 表示如果超过这个时间还没有结束就抛出异常
    timeout: 30 * 1000,
    waitUtil: ['networkidle0'],
  })
  console.log('page load finished!')
})()
