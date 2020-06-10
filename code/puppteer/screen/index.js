const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  })
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
