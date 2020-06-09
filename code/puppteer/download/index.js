const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  const cdp = await page.target().createCDPSession()
  await cdp.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './download',
  })
  // 进入页面触发 websocket 按钮
  await page.goto('http://10.9.9.76:8801/iomp/#/login', {
    waitUntil: 'networkidle0',
  })
  const username = await page.$('[placeholder="请输入用户名"]')
  const password = await page.$('[placeholder="请输入用户密码"]')
  const button = await page.$('.el-button--primary')
  await username.type('admin', { delay: 50 })
  await password.type('kedacom', { delay: 50 })
  await Promise.all([button.click(), page.waitForNavigation()])

  await page.goto('http://10.9.9.76:8801/iomp/#/colony/list', {
    waitUntil: 'networkidle0',
  })
})()
