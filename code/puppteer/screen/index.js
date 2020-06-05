const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.baidu.com')
  // 页面截图
  await page.screenshot({
    path: './files/capture.png',
    type: 'png',
    fullPage: true,
  })
  console.log('page captured!')
  // 页面元素截图
  const element = await page.$('#su')
  await element.screenshot({
    path: './files/button.png',
    type: 'png',
  })
  console.log('button captured!')
})()
