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
  await screenshot(page, '1-login')
  const $username = await page.$('[name="username"]')
  const $password = await page.$('[name="password"]')
  const $button = await page.$('#submit_login')
  await $username.type(config.username, { delay: 100 })
  await $password.type(config.password, { delay: 100 })
  await screenshot(page, '2-logined')
  await Promise.all([$button.click(), page.waitForNavigation()])
  try {
    await page.waitForSelector('.icon-fabu', {
      timeout: 8000,
    })
    await screenshot(page, '3-projectList')
    getProject(page, browser)
    // apiInspect(page, browser)
  } catch (error) {
    console.log('Page jump error')
    await screenshot(page, '3-pageJumpError')
    page.close()
    browser.close()
  }
})()

const getProject = async (page, browser) => {
  // 搜索按钮
  const $markInput = await page.$('[placeholder="请输入项目标识"]')
  const $searchWrap = await page.$('.operation-item')
  const $searchButton = await $searchWrap.$('.el-button')
  await $markInput.type(config.projectMark)
  await $searchButton.click()
  await page.waitFor(1500)
  await screenshot(page, '4-projectListSearched')
  const $rows = await page.$$('.el-table__row')

  if (!$rows || $rows.length === 0) {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    await screenshot(page, '5-projectNotFound')
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
        await screenshot(page, '5-publishDialog')
        await triggerPublish(page)
        await page.waitFor(4000)
        domInspect(page, browser)
      }
    }
  })
}

const triggerPublish = (page) => {
  return new Promise(async (resolve) => {
    const $releaseDialog = await page.$('.releaseComponent')
    const $button = await $releaseDialog.$('.el-button--primary')
    await $button.click()
    resolve(true)
  })
}

const domInspect = async (page, browser) => {
  await page.evaluate(async () => {
    window.handleApply = function () {
      const $rows = document.querySelectorAll('.el-table__row')
      if ($rows && $rows.length > 0) {
        const $row = $rows[0]
        const $status = $row.querySelector('[prop="statusLabel"]')
        console.log('$status.innerText:', $status.innerText)
        let innerText = $status.innerText
        innerText = innerText.trim ? innerText.trim() : innerText
        return $status && innerText === '部署完成'
      }
    }
  })

  try {
    await page.waitForFunction('window.handleApply()', {
      timeout: 20 * 60 * 1000,
      polling: 2000,
    })
    await screenshot(page, '6-published')
    page.close()
    browser.close()
  } catch (error) {
    console.log(error)
    await screenshot(page, '6-publishFailed')
  }
}

// const apiInspect = async (page, browser) => {
//   let applyId = ''
//   // 接口报错截图
//   page.on('response', (response) => {
//     const url = response.url()
//     response.text().then(async (body) => {
//       if (url.includes(applyUrl)) {
//         const res = JSON.parse(body)
//         if (res.code === '0') {
//           applyId = res.result.releaseApplyId
//         } else {
//           page.waitFor(500)
//           await screenshot(page, '6-applyFailed')
//           const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
//           log(`${time}  ${body}\r`)
//           page.close()
//           browser.close()
//         }
//       } else if (url.includes(historyListUrl)) {
//         const res = JSON.parse(body)
//         if (res.code === '0') {
//           if (res.result.deployStatus === 15) {
//             console.log('发布完成！')
//             await screenshot(page, '6-published')
//             page.close()
//             browser.close()
//           }
//         } else {
//           page.waitFor(500)
//           await screenshot(page, '6-publishFailed')
//           log(`${time}  ${body}\r`)
//         }
//       }
//     })
//   })
// }

const handleError = async (page) => {
  // pageerror
  // page.on('pageerror', async (err) => {
  //   const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
  //   console.error('pageerror:', err.toString())
  //   await screenshot(page, `pageerror-${time}`)
  //   log(`${time}  ${err.toString()}\r`)
  // })
  // error
  page.on('error', async (err) => {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    console.error('error: ', err.toString())
    await screenshot(page, `error-${time}`)
    screenshot(page, `error-${time}`)
    log(`${time}  ${err.toString()}\r`)
  })
  // requestfailed
  page.on('requestfailed', async (request) => {
    const time = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')
    console.error(
      `${time}  requestfailed url: ${request.url()}, errText: ${
        request.failure().errorText
      }, method: ${request.method()}\r`
    )
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
