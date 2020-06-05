const puppeteer = require('puppeteer')

;(async () => {
  const browser = puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  const blockTypes = ['image']
  await page.setRequestInterception(true)
})()
