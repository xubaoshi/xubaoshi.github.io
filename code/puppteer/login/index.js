const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto('http://10.9.9.76:8801/iomp', {
    waitUntil: 'networkidle0',
  })
  const username = await page.$('[placeholder="请输入用户名"]')
  const password = await page.$('[placeholder="请输入用户密码"]')
  const button = await page.$('.el-button--primary')
  await username.type('admin', { delay: 50 })
  await password.type('kedacom', { delay: 50 })

  // 待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
  await Promise.all([button.click(), page.waitForNavigation()])

  await page.screenshot({
    path: './files/home.png',
    type: 'png',
  })

  console.log()
  page.close()
  browser.close()
})()
