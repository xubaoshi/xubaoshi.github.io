const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  const page = await browser.newPage()
  await page.goto('http://www.baidu.com', {
    // timeout 表示如果超过这个时间还没有结束就抛出异常
    timeout: 30 * 1000,
    waitUtil: ['networkidle0'],
  })
  console.log('page load finished!')
})()
