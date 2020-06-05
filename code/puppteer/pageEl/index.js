const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100,
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,960'],
  })
  const page = await browser.newPage()
  page.goto('http://www.baidu.com')

  const image = await page.waitForXPath('//img')
  console.log('image', image)

  const selector = await page.waitForSelector(
    '[href="http://xueshu.baidu.com"]'
  )
  console.log('selector', selector)

  const request = await page.waitForRequest(
    'https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/baiduyun@2x-e0be79e69e.png'
  )
  console.log('request', request)
  
  const respone = await page.waitForResponse(
    'https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/baiduyun@2x-e0be79e69e.png'
  )
  console.log('respone', respone)
})()
