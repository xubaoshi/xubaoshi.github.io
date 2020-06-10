const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  })
  const page = await browser.newPage()
  const blockTypes = ['image']
  // 开启拦截请求
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    const type = request.resourceType()
    const shouldBlock = blockTypes.includes(type)
    if (shouldBlock) {
      return request.abort()
    } else {
      // 重写请求
      return request.continue({
        headers: Object.assign({}, request.headers, {
          'puppeteer-test': 'true',
        }),
      })
    }
  })
  await page.goto('https://www.baidu.com')
})()
