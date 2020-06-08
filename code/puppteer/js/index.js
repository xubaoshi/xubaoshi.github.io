const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
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
