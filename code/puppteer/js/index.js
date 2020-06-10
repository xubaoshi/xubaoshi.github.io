const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  })
  const page = await browser.newPage()
  await page.goto('https://www.baidu.com', {
    waitUntil: 'networkidle0',
  })
  await page.evaluate(async () => {
    const element = document.querySelector('#su')
    element.style.color = 'red'
  })
})()
