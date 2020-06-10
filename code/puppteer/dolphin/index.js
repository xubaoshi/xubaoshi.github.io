const puppeteer = require('puppeteer')
const moment = require('moment')
const fs = require('fs-extra')
const path = require('path')
const config = require('./config.json')

const projectUrl = 'https://ctsp.kedacom.com/drelease#/projectMgt'
const applyUrl = 'https://ctsp.kedacom.com/drelease/project/publish/apply'
const historyListUrl =
  'https://ctsp.kedacom.com/drelease/project/publish/release/log'
const current = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 1000 },
    args: [`--window-size=${1440},${1000}`],
    ignoreHTTPSErrors: false, //忽略 https 报错
  })
  const page = await browser.newPage()
  handleError(page)
  await page.goto(projectUrl)
  await page.waitFor(2000)
  await screenshot(page, 'login')
  const $username = await page.$('[name="username"]')
  const $password = await page.$('[name="password"]')
  const $button = await page.$('#submit_login')
  await $username.type(config.username, { delay: 100 })
  await $password.type(config.password, { delay: 100 })
  await screenshot(page, 'logined')
  await Promise.all([$button.click(), page.waitForNavigation()])
  await page.waitFor(2000)
  await screenshot(page, 'projectList')
  getProject(page, browser)
  apiInspect(page, browser)
})()

const getProject = async (page, browser) => {
  // 搜索按钮
  const $markInput = await page.$('[placeholder="请输入项目标识"]')
  const $searchWrap = await page.$('.operation-item')
  const $searchButton = await $searchWrap.$('.el-button')
  await $markInput.type(config.projectMark)
  await $searchButton.click()
  await page.waitFor(1500)
  await screenshot(page, 'projectListSearched')
  const $rows = await page.$$('.el-table__row')

  if (!$rows || $rows.length === 0) {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    await screenshot(page, 'projectNotFound')
    log(`${time} 项目不存在`)
    page.close()
    browser.close()
  }

  $rows.map(async (item) => {
    const innerTextArr = await item.$$eval('.cell', (nodes) => {
      return nodes.map((node) => {
        return node.innerText
      })
    })
    if (innerTextArr.includes(config.projectMark)) {
      const $publish = await item.$('.icon-fabu')
      if ($publish) {
        await $publish.click()
        await page.waitFor(2000)
        await screenshot(page, 'publishDialog')
        triggerPublish(page)
      }
    }
  })
}

const triggerPublish = async (page) => {
  const $releaseDialog = await page.$('.releaseComponent')
  const $button = await $releaseDialog.$('.el-button--primary')
  await $button.click()
}

const apiInspect = async (page, browser) => {
  let applyId = ''
  // 接口报错截图
  page.on('response', (response) => {
    const url = response.url()
    response.text().then(async (body) => {
      if (url.includes(applyUrl)) {
        const res = JSON.parse(body)
        if (res.code === '0') {
          applyId = res.result.releaseApplyId
        } else {
          page.waitFor(500)
          await screenshot(page, 'applyFailed')
          const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
          log(`${time}  ${body}\r`)
        }
      } else if (url.includes(historyListUrl)) {
        const res = JSON.parse(body)
        if (res.code === '0') {
          if (res.result.deployStatus === 15) {
            console.log('发布完成！')
            await screenshot(page, 'published')
            page.close()
            browser.close()
          }
        } else {
          page.waitFor(500)
          await screenshot(page, 'publishFailed')
          log(`${time}  ${body}\r`)
        }
      }
    })
  })
}

const handleError = async (page) => {
  // pageerror
  page.on('pageerror', async (err) => {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    console.error('pageerror:', err.toString())
    await screenshot(page, `pageerror-${time}`)
    log(`${time}  ${err.toString()}\r`)
  })
  // error
  page.on('error', async (err) => {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    console.error('error: ', err.toString())
    await screenshot(page, `error-${time}`)
    screenshot(page, `error-${time}`)
    log(`${time}  ${err.toString()}\r`)
  })
  // requestfailed
  page.on('requestfailed', async (reg) => {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    console.error('requestfailed:', err)
    await screenshot(page, `requestfailed-${time}`)
    log(
      `${time}  requestfailed url: ${request.url()}, errText: ${
        request.failure().errorText
      }, method: ${request.method()}\r`
    )
  })
}

const screenshot = async (page, fileName) => {
  return new Promise(async (resolve) => {
    const targetFolder = path.join(__dirname, `/files/${current}`)
    fs.ensureDirSync(targetFolder)
    await page.screenshot({
      path: `${targetFolder}/${fileName}.png`,
      type: 'png',
      fullPage: true,
    })
    resolve(true)
  })
}

const log = async (content) => {
  const targetFolder = path.join(__dirname, `/files/${current}/error.log`)
  fs.ensureFileSync(targetFolder)
  fs.appendFileSync(targetFolder, content)
}
