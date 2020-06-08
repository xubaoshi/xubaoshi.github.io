const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  // 创建 cdp 会话
  let cdpSession = await page.target().createCDPSession()
  // 开启网络调试，监听 Chrome DevTools Protocol 中 Network 事件
  await cdpSession.send('Network.enable')
  // 监听 websocket received 事件
  cdpSession.on('Network.webSocketFrameReceived', (frame) => {
    let payloadData = frame.response.payloadData
    console.log('websocket payloadData:', payloadData)
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
  await page.goto('http://10.9.9.76:8801/iomp/#/service/list')
  await page.waitFor(4000)
  const terminal = await page.$('.icon-zhongduan')
  await terminal.click()
})()
