---
layout: post
title: '美团 Logan Web SDK 源码分析'
date: '2021-06-20'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---


<a name="aWF6I"></a>
## 简介

<br />Logan 开源的是一整套日志体系，包括日志的收集存储，上报分析以及可视化展示。提供了五个组件，包括端上日志收集存储 、[iOS SDK](https://github.com/Meituan-Dianping/Logan/tree/master/Logan/iOS)、[Android SDK](https://github.com/Meituan-Dianping/Logan/tree/master/Example/Logan-Android)、[Web SDK](https://github.com/Meituan-Dianping/Logan/tree/master/Logan/WebSDK)，后端日志存储分析 [Server](https://github.com/Meituan-Dianping/Logan/tree/master/Logan/Server)，日志分析平台 [LoganSite](https://github.com/Meituan-Dianping/Logan/tree/master/Logan/LoganSite)。<br />​

![](https://camo.githubusercontent.com/a73d7ec02c73fb1b0595dbca7c712019964542e0340ad3006bc576662162a0a6/68747470733a2f2f6d73732d73686f6e2e73616e6b7561692e636f6d2f76312f6d73735f37643663643834623532643534333234386262623733346162643339326539612f6c6f67616e2d6f70656e2d736f757263652f6c6f67616e5f617263682e706e67#from=url&id=bDIX5&margin=%5Bobject%20Object%5D&originHeight=748&originWidth=1914&originalType=binary&ratio=1&status=done&style=none)<br />​

很多时候，开发者本地难以复现或触达用户端的异常情况，通过收集用户端上完整的日志流及上下文信息能够帮助开发者更有效地还原问题现场，定位并解决这些疑难杂症。Logan 采用用户端本地存储及触发时上报方式收集日志，可以一定程度上减小流量的开销及服务器的压力。<br />​

本文主要针对 Logan 的 Web SDK 进行源码分析，深入了解 SDK 内部具体做了什么。<br />

<a name="snacX"></a>
## 使用方法


<a name="kBZpx"></a>
### 下载
```shell
npm install --save logan-web
```


<a name="v4jvi"></a>
### api概览


<a name="tCotB"></a>
#### initConfig
该方法为 Logan 单例设定全局配置。一般情况下你只需在引入 Logan 后执行一次该方法，设定好全局参数即可。<br />​<br />

- reportUrl (可选): 用于接收上报日志的服务器地址。如果在调用 report 方法时也配置了 reportUrl，会优先采用那个地址进行上报。
- publicKey (可选): 1024 位的 RSA 加密公钥. 如果你需要调用 logWithEncryption() 方法对本地日志进行加密操作，那么你必须事先配置该公钥。与该公钥配对的私钥存储于你的服务器上。
- logTryTimes (可选): Logan 在遇到本地存储失败的情况下，会尝试的次数。默认为 3 次。如果 Logan 存储失败了 logTryTimes 次数后将不再进行后续日志的存储。
- dbName (可选): 你可以配置该项来自定义本地 DB 库的名字。默认为 logan_web_db。不同DB 库之间的数据是隔离而不受影响。
- errorHandler (可选): 你可以配置该项来接收 log() 和 logWithEncryption() 方法可能产生的异常. Logan 的 log 及 logWithEncryption 方法在底层会执行异步存储，因此你无需等待这两个方法的返回。如果你确实想知道 Logan 在存储时是否报错了，你可以配置该方法来获取异常。
- succHandler (可选): 你可以配置该项回调，该方法会在 log() 和 logWithEncryption() 方法内异步存储日志成功后执行。

​<br />
```javascript
import Logan from 'logan-web';
Logan.initConfig({
	reportUrl: 'https://yourServerAddressToAcceptLogs',
	publicKey: '-----BEGIN PUBLIC KEY-----\n'+
        'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG2m5VVtZ4mHml3FB9foDRpDW7Pw\n'+
        'Foa+1eYN777rNmIdnmezQqHWIRVcnTRVjrgGt2ndP2cYT7MgmWpvr8IjgN0PZ6ng\n'+
        'MmKYGpapMqkxsnS/6Q8UZO4PQNlnsK2hSPoIDeJcHxDvo6Nelg+mRHEpD6K+1FIq\n'+
        'zvdwVPCcgK7UbZElAgMBAAE=\n'+
        '-----END PUBLIC KEY-----',
   // ...
});
Logan.logWithEncryption('confidentialLogContent', 1);
```


<a name="Sphtg"></a>
#### log


- content: 日志内容。
- logType: 日志类型。自定义的日志类型。
```javascript
import Logan from 'logan-web';
let logContent = 'Your log content';
let logType = 1;
Logan.log(logContent, logType);
```
使用 log 方法可以将本地日志按序保存在浏览器的 IndexedDB 库中。
#### logWithEncryption
​
需要调用 logWithEncryption() 方法对本地日志进行加密操作，那么你必须事先配置该公钥。与该公钥配对的私钥存储于你的服务器上<br />​<br />

- content: 日志内容。
- logType: 日志类型。自定义的日志类型。
#### report

会从本地 DB 库中获取指定天的日志逐天进行上报。

- fromDayString: 上报该天及之后的日志，YYYY-MM-DD 格式。
- toDayString: 上报该天及之前的日志，YYYY-MM-DD 格式.
- reportUrl (可选): 用于接收本地上报日志内容的服务器地址。如果你已通过 initConfig() 设置了同样的 reportUrl 作为全局上报地址，该项可略。
- deviceId（可选）: 该用户端环境的唯一标识符，用于区分其他设备环境上报的日志，你需要通过该标识符在服务端检索已上报的日志信息。
- webSource (可选): 当前上报来源，如Chrome、微信、QQ等。
- environment (可选): 当前环境信息，如当前UA信息等。
- customInfo (可选): 当前用户或业务附加信息。
- incrementalReport(可选): 若设为true，则本次上报为增量上报，上报的日志将从本地删除。默认为false。
- xhrOptsFormatter(可选): 可设置自定义的xhr配置来覆盖默认的logan上报数据以及xhr设置。你可以参考下面用法示例2。
```javascript
import Logan from 'logan-web';
const reportResult = await Logan.report({
    reportUrl: 'https://yourServerAddressToAcceptLogs',
    deviceId: 'LocalDeviceIdOrUnionId',
    fromDayString: '2019-11-06',
    toDayString: '2019-11-07'
});
```
`report` 方法的使用方式可在用户点击使用反馈或应用出现错误是时使用。<br />

<a name="TJVGt"></a>
## 源码概览

<br />访问地址  [https://github.com/Meituan-Dianping/Logan/blob/master/Logan/WebSDK/README.ch.md](https://github.com/Meituan-Dianping/Logan/blob/master/Logan/WebSDK/README.ch.md)<br />刨除示例代码、静态资源、测试代码、以及项目构建配置等，本文针对 src 下的代码文件。<br />​

![/img/logan/1.png](/img/logan/1.png)<br />
<br />整体架构如下：<br />
<br />![/img/logan/2.png](/img/logan/2.png)
<a name="QNvfa"></a>
### initConfig

`src/index.ts`  

1. 传入外部配置

```javascript
import Config from './global-config';
// ...
export function initConfig (globalConfig: GlobalConfig): void {
    Config.set(globalConfig);
}
export default {
  // ...
  initConfig
}
```

`src/global-config.ts`  

2. 通过 typeof 判断出入的配置是否可以覆盖

```javascript
// ...

function validOrBackup (
    param: any,
    type: 'string' | 'number' | 'function',
    backup: any
): any {
    return typeof param === type ? param : backup;
}
export default {
    set: (configOb: GlobalConfig): void => {
        globalConfig = {
            publicKey: validOrBackup(configOb.publicKey, 'string', undefined),
            logTryTimes: validOrBackup(
                configOb.logTryTimes,
                'number',
                DEFAULT_TRY_TIMES
            ),
            reportUrl: validOrBackup(configOb.reportUrl, 'string', undefined),
            // ...
        };
    },
    get: (propertyKey: keyof GlobalConfig): any => {
        // ...
    }
};
```
<a name="r55rZ"></a>
### log

src/index.ts`  
#### 数据处理及逻辑判断
```javascript

import LogManager from './log-manager';

// ...
function standardLog (content: string, logType: number, encryptVersion: LogEncryptMode): never | void {
    try {
  			// 2.类型字段校验
        logParamChecker(logType, LogEncryptMode.PLAIN);
    } catch (e) {
        (Config.get('errorHandler') as Function)(e);
    }
		// 3.存储日志
    logIfLoaded({
        logContent: logContentWrapper(content, logType),
        encryptVersion
    });
}
function logParamChecker (logType: number, encryptVersion: LogEncryptMode): never | void {
    if (typeof logType !== 'number') {
        throw new Error('logType needs to be set');
    }
    if (encryptVersion === LogEncryptMode.RSA) {
        if (!Config.get('publicKey')) {
            throw new Error(
                'publicKey needs to be set before logWithEncryption'
            );
        }
    }
}
function logIfLoaded (logItem: LogConfig): void {
  	// 4.判断当前页面是够加载完成
    if (
        !document.readyState ||
        (document.readyState && document.readyState === 'complete')
    ) {
  			// 5.1 异步存储日志
        logAsync(logItem);
    } else {
      	// 5.2 没有加载完成推送待存储队列
        logQueueBeforeLoad.push(logItem);
    }
}

function onWindowLoad (): void {
    logQueueBeforeLoad.forEach(logItem => {
        logAsync(logItem);
    });
    logQueueBeforeLoad = [];
    window.removeEventListener('load', onWindowLoad);
}
// 5.2.1 页面加载完成遍历 logQueueBeforeLoad 一个个存储日志
window.addEventListener('load', onWindowLoad);
// ...


async function logAsync (logItem: LogConfig): Promise<void> {
    // No need to async import if tryTimes exceeds.
    // 6. 判断是否可以存储日志 
  	// async await 抓取异常需要包裹 try catch
    if (LogManager.canSave()) {
        try {
  					// 7. 异步加载 save-log.ts 并调用传入日志对象
  					// 其中 import 方法依赖 webpack， 被引用的文件会打包成一个单独的 chunk
  					// LogManager.save 及 save-log 的实现逻辑参考下面代码
            const saveLogModule = await import(
                /* webpackChunkName: "save_log" */ './save-log'
            );
            saveLogModule.default(logItem);
        } catch (e) {
            LogManager.errorTrigger();
            await (Config.get('errorHandler') as Function)(e);
        }
    } else {
        await (Config.get('errorHandler') as Function)(new Error(ResultMsg.EXCEED_TRY_TIMES));
    }
}


/**
 * Save one log locally.
 * @param content Log content.
 * @param logType Log type.
 */
export function log (content: string, logType: number): void {
  	// 1. 日志内容、日志类型（用户自定义）、加密类型
    standardLog(content, logType, LogEncryptMode.PLAIN);
}

export default {
  // ...
  log
}
```
webpack 中拦截加载的说明参考如下:<br />[https://webpack.docschina.org/guides/lazy-loading/](https://webpack.docschina.org/guides/lazy-loading/)
#### 是否可以存储日志

`src/log-manager.ts`  ​

LogManager.canSave 实现逻辑如下 :
```javascript
import Config from './global-config';
let logTryQuota: number = Config.get('logTryTimes') as number;
function errorTrigger (): void {
  	// 发生异常时触发错误技术 重试数量减一
    if (logTryQuota > 0) {
        logTryQuota--;
    }
}

function canSave (): boolean {
  	// 重试错误小于等于 0 时
    return logTryQuota > 0;
}

function resetQuota (): void {
    logTryQuota = Config.get('logTryTimes') as number;
}

export default {
    errorTrigger,
    canSave,
    resetQuota
};
```
​
LogManager 内部主要做了一个计数器的作用，如果 Logan 存储失败了 logTryTimes（默认为 3 次） 次数后将不再进行后续日志的存储。<br />​<br />
<a name="cZArE"></a>
#### 保存日志操作
​

`src/save-log.ts` :

```javascript
// ...
import Config from './global-config';
import LoganDB from './lib/logan-db';
import LogManager from './log-manager';
import { invokeInQueue } from './logan-operation-queue';

// ...
let LoganDBInstance: LoganDB;
function base64Encode (text: string): string {
    // ...
}

export default async function saveLog (logConfig: LogConfig): Promise<void> {
    try {
  			// 1.是否可以存储
        if (!LogManager.canSave()) {
            throw new Error(ResultMsg.EXCEED_TRY_TIMES);
        }
				// 2.是否支持 IndexedDB
        if (!LoganDB.idbIsSupported()) {
            throw new Error(ResultMsg.DB_NOT_SUPPORT);
        }
        // 3. 初始化 IndexedDB 实例
        if (!LoganDBInstance) {
            LoganDBInstance = new LoganDB(Config.get('dbName') as
                | string
                | undefined);
        }
        if (logConfig.encryptVersion === LogEncryptMode.PLAIN) {
          	// 4. base64 加密 log 内容
            const logStringOb: LogStringOb = {
                l: base64Encode(logConfig.logContent)
            };
          	// 
          	// 5.按照队列顺序依次推入日志内容
            await invokeInQueue(async () => {
                await LoganDBInstance.addLog(
                    JSON.stringify(logStringOb)
                );
            });
        } else if (logConfig.encryptVersion === LogEncryptMode.RSA) {
            const publicKey = Config.get('publicKey');
            const encryptionModule = await import(
                    /* webpackChunkName: "encryption" */ './lib/encryption'
            );
            const cipherOb = encryptionModule.encryptByRSA(
                logConfig.logContent,
                `${publicKey}`
            );
          	// 6. RSA加密
            const logStringOb: LogStringOb = {
                l: cipherOb.cipherText,
                iv: cipherOb.iv,
                k: cipherOb.secretKey,
                v: LogEncryptMode.RSA
            };
          	// 7. 按照队列顺序依次推入日志内容
            await invokeInQueue(async () => {
                await LoganDBInstance.addLog(
                    JSON.stringify(logStringOb)
                );
            });
        } else {
            throw new Error(`encryptVersion ${logConfig.encryptVersion} is not supported.`);
        }
        await (Config.get('succHandler') as Function)(logConfig);
    } catch (e) {
        LogManager.errorTrigger();
        await (Config.get('errorHandler') as Function)(e);
    }
}
```


<a name="xJf8j"></a>
#### 执行队列按序存储

<br />由于Logan的log方法涉及LoganDB日志存储空间大小的改写、report方法在做增量上报时涉及本地日志数据的删除，这些方法被异步执行时可能会发生竞态条件导致DB内数据不准确，进而导致已存储的日志大小远超过存储空间限制、在触发上报时段写入的日志被删除这类问题，因此Logan需要内部维护该执行列表，确保这些异步方法按序一一执行。<br />​<br />
```javascript
const loganOperationQueue: PromiseItem[] = [];
let operationRunning: boolean = false;
// ...
async function loganOperationsRecursion (): Promise<void> {
  	// 2. 如果队列数量大于0 同时没有正在进行存储操作则进行下一个存储
    while (loganOperationQueue.length > 0 && !operationRunning) {
      	// push shift 先入先出策略
        const nextOperation = loganOperationQueue.shift() as PromiseItem;
        operationRunning = true;
        try {
            const result = await nextOperation.asyncF();
            nextOperation.resolution(result);
        } catch (e) {
            nextOperation.rejection(e);
        }
        operationRunning = false; /* eslint-disable-line */ // No need to worry require-atomic-updates here.
        loganOperationsRecursion();
    }
}
export function invokeInQueue (asyncF: Function): Promise<any> {
    return new Promise((resolve, reject) => {
        loganOperationQueue.push({
            // 1. asyncF 为上面传入的
          	// await invokeInQueue(async () => {
            //    await LoganDBInstance.addLog(
            //        JSON.stringify(logStringOb)
            //    );
            // });
            asyncF,
            resolution: resolve,
            rejection: reject
        });
        loganOperationsRecursion();
    });
}
```
​

`await LoganDBInstance.addLog(JSON.stringify(logStringOb))`  主要作用是将处理好的日志内容通过 `src/lib/logan-db.ts` 所封装的 IndexedDB 工具实例存储到本地浏览器中。 IndexedDB 工具实例由 idb-managed 对 IndexedDB 的 api 进行二次封装。<br />​<br />
<a name="frHXq"></a>
#### IndexedDB
​

![/img/logan/3.png](/img/logan/3.png)<br />

<a name="TcfeI"></a>
##### 浏览器上的存储
| 特性 | Cookie | localStorage | sessionStorage |
| --- | --- | --- | --- |
| 数据的生命期 | 一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效 | 除非被清除，否则永久保存 | 仅在当前会话下有效，关闭页面或浏览器后被清除 |
| 存放数据大小 | 4K左右 | 一般为5MB | 一般为5MB |
| 与服务器端通信 | 每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 |
| 易用性 | 需要程序员自己封装，源生的Cookie接口不友好 | 源生接口可以接受，亦可再次封装来对Object和Array有更好的支持 | 源生接口可以接受，亦可再次封装来对Object和Array有更好的支持 |

​<br />
<a name="hvGTA"></a>
##### IndexedDB
IndexedDB 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作，大量数据储存在客户端（相较于上面三种）。IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。<br />​<br />

- 数据库：IDBDatabase 对象<br />数据库是一系列相关数据的容器。每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。IndexedDB 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。
- 对象仓库：IDBObjectStore 对象<br />每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格。
- 索引： IDBIndex 对象<br />为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引,如果不建立索引，默认只能搜索主键。
- 事务： IDBTransaction 对象<br />数据记录的读写和删改，都要通过事务完成。事务对象提供error、abort和complete三个事件，用来监听操作结果。这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。
- 操作请求：IDBRequest 对象<br />indexedDB.open()方法返回一个 IDBRequest 对象。这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果。
- 指针： IDBCursor 对象<br />遍历数据表格的所有记录，要使用指针对象 IDBCursor。
- 主键集合：IDBKeyRange 对象<br />利用索引查询与特定条件匹配的所有记录

​<br />

1. 打开数据库/新建数据库
```javascript
var request = window.indexedDB.open(databaseName, version);
```
indexedDB.open()方法返回一个 IDBRequest 对象。这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果。<br />新建数据库与打开数据库是同一个操作，如果指定的数据库不存在，则会新建一个。<br />​<br />
```javascript
request.inupgradeneeded = function(event) {
	db = event.target.result
}
```
​

如果 `open` 指定的版本号大于已有版本或新建数据库时，`inupgradeneeded` 事件才会触发。否则在 success 回调事件内部处理。<br />​<br />
```javascript
request.onsuccess = function (event) {
  db = request.result;
};
```


2. 创建数据库表

接上面的操作（如果是新的数据库则在 `inupgradeneeded`  回调事件内部执行），在数据库中新建对象仓库（也可以理解为数据库中的表）

```javascript
// ...

var objectStore
if (!db.objectStoreNames.contains('person')) {
	// 设置 id 为主键索引
  objectStore = db.createObjectStore('person', {keyPath: 'id'})
  // 如果没有合适的字段作为主键则可以自动生成
  objectStore = db.createObjectStore('person', {autoIncrement: true})
  
  // createIndex 创建索引 配置主键等
  objectStore.createIndex('email', 'email', { unique: true });
}
```
​<br />

3. 新增数据

写入数据需要事务进行处理

```javascript
var request = db.transaction(['person'], 'readwrite')
								.objectStore('persion')
								.add({id: 1, name: '张三', email: 'xx@qq.com'})

request.onsuccess = function(event) {
	//...
}

request.onerror = function(event) {
	//...
}
```
​

新建时必须指定表格名称和操作模式（"只读"或"读写"）。新建事务以后，通过IDBTransaction.objectStore(name)方法，拿到 IDBObjectStore 对象，再通过表格对象的add()方法，向表格写入一条记录。

4. 读取数据



```javascript
var transaction =  db.transaction('[person]')
var objectStore = transaction.objectStore('person')
var request = objectStore.get(1);

request.onsuccess = function(event) {
	//...
}

request.onerror = function(event) {
	if (request.result) {
    // ...
  } else {
  	// ...
  }
}
```


5. 遍历数据

遍历数据表格的所有记录
```javascript
var objectStore = db.transaction('person').objectStore('person');

objectStore.openCursor().onsuccess = function(event) {
	var cursor = event.target.result
  
  // 当前其中一条数据
}
```
​<br />

6. 更新数据
```javascript
var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });
```

7. 删除数据

```javascript
var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);
```


<a name="QB1pV"></a>
##### 原生 IndexedDB API 的局限

1. 版本升级问题<br />本地 DB 依靠版本的升级来更新库表结构，当本地该 DB 的版本升级后，尝试连接低版本 DB 的操作将失败。
1. IndexedDB 不提供数据的时效设置与过期数据清理
1. 不提供多表间的原子性增删操作<br />原生的 IndexedDB API 只提供了单条数据的添加，以及单表内的数据批量删除操作，并不直接提供 API 对多表的数据进行添加或者删除。所谓原子性表示一个事务的所有操作要么不间断地全部被执行，要么一个也没有执行。



<a name="nJmnI"></a>
#### idb-managed
 如上面所述 idb 解决了上面远程 IndexedDB 在使用上的问题。<br />​

**下载**<br />**​**<br />
```javascript
npm install --save idb-managed
```


```javascript
import { CustomDB } from 'idb-managed';

/* Define db and table structures first. */
let db = new CustomDB({
	dbName: 'DEMO_DB',
	dbVersion: 1,
	itemDuration: 5000 * 3600,
	tables: {
		STUDENTS: {
			primaryKey: 'studentId',
			indexList: [
				{
					indexName: 'name',
					unique: false
				},
				{
					indexName: 'age',
					unique: false
				}
			],
			itemDuration: 1000 * 3600
		},
		OTHER_INFO: {}
	}
});
```
<a name="IKLzg"></a>
#### LoganDB 的实现 

<br />`src/lib/logan-db.ts`<br />​<br />
```javascript
import { CustomDB, idbIsSupported, deleteDB } from 'idb-managed';
import { dateFormat2Day, M_BYTE, sizeOf, getStartOfDay, dayFormat2Date } from './utils';
// ...
// 默认版本号
const LOGAN_DB_VERSION = 1;
// 默认 db 名称
const LOGAN_DB_NAME = 'logan_web_db';
// 默认日志详情表名称
const LOG_DETAIL_TABLE_NAME = 'logan_detail_table';
// 索引字段
const LOG_DETAIL_REPORTNAME_INDEX = 'logReportName';
// 索引字段
const LOG_DETAIL_CREATETIME_INDEX = 'logCreateTime';
// 默认日志天表名称
const LOG_DAY_TABLE_NAME = 'log_day_table';
// 索引字段
export const LOG_DAY_TABLE_PRIMARY_KEY = 'logDay';
export type FormattedLogReportName = string;
// 日志保留时长（7天）
const DEFAULT_LOG_DURATION = 7 * 24 * 3600 * 1000; // logan-web keeps 7 days logs locally
// 每天日志最大容量（7M）
const DEFAULT_SINGLE_DAY_MAX_SIZE = 7 * M_BYTE; // 7M storage limit for one day
// 每个页最大容量（1M）
const DEFAULT_SINGLE_PAGE_MAX_SIZE = 1 * M_BYTE; // 1M storage limit for one page


export default class LoganDB {
    public static idbIsSupported = idbIsSupported;
    public static deleteDB = deleteDB;
    private DB: CustomDB;
    constructor(dbName?: string) {
        // 初始化数据库及数据表
        this.DB = new CustomDB({
            dbName: dbName || LOGAN_DB_NAME,
            dbVersion: LOGAN_DB_VERSION,
            tables: {
                [LOG_DETAIL_TABLE_NAME]: {
                    indexList: [
                        {
                            indexName: LOG_DETAIL_REPORTNAME_INDEX,
                            unique: false
                        },
                        {
                            indexName: LOG_DETAIL_CREATETIME_INDEX,
                            unique: false
                        }
                    ]
                },
                [LOG_DAY_TABLE_NAME]: {
                    primaryKey: LOG_DAY_TABLE_PRIMARY_KEY
                }
            }
        });
    }
    // ... logReportNameFormatter  获取 log 名称 ${logDay}_${pageIndex}
    // ... logReportNameParser  分隔 log 名称（_） logDay pageIndex
    // 获取指定天数的日志信息
    async getLogDayInfo (logDay: string): Promise<LoganLogDayItem | null> {
        return ((await this.DB.getItem(
            LOG_DAY_TABLE_NAME,
            logDay
        )) as any) as LoganLogDayItem | null;
    }
    // 获取日期范围的日志
    async getLogDaysInfo (
        fromLogDay: string,
        toLogDay: string
    ): Promise<LoganLogDayItem[]> {
        if (fromLogDay === toLogDay) {
            const result = ((await this.DB.getItem(
                LOG_DAY_TABLE_NAME,
                fromLogDay
            )) as any) as LoganLogDayItem | null;
            return result ? [result] : [];
        } else {
            return ((await this.DB.getItemsInRange({
                tableName: LOG_DAY_TABLE_NAME,
                indexRange: {
                    indexName: LOG_DAY_TABLE_PRIMARY_KEY,
                    lowerIndex: fromLogDay,
                    upperIndex: toLogDay,
                    lowerExclusive: false,
                    upperExclusive: false
                }
            })) as any[]) as LoganLogDayItem[];
        }
    }
    // 根据名称获取日志
    async getLogsByReportName (
        reportName: FormattedLogReportName
    ): Promise<LoganLogItem[]> {
        const logs = ((await this.DB.getItemsInRange({
            tableName: LOG_DETAIL_TABLE_NAME,
            indexRange: {
                indexName: LOG_DETAIL_REPORTNAME_INDEX,
                onlyIndex: reportName
            }
        })) as any[]) as LoganLogItem[];
        return logs;
    }
    // 添加日志
    async addLog (logString: string): Promise<void> {
      	// 1. 计算当前内容大小
        const logSize = sizeOf(logString);
        const now = new Date();
        const today: string = dateFormat2Day(now);
				// 2. 当天的日志内容
        const todayInfo: LoganLogDayItem = (await this.getLogDayInfo(
            today
        )) || {
            [LOG_DAY_TABLE_PRIMARY_KEY]: today,
            totalSize: 0,
            reportPagesInfo: {
                pageSizes: [0]
            }
        };
				// 3. 当天的日志数量大于最大则抛出错误 throw 终止后面的 js 执行
        if (todayInfo.totalSize + logSize > DEFAULT_SINGLE_DAY_MAX_SIZE) {
            throw new Error(ResultMsg.EXCEED_LOG_SIZE_LIMIT);
        }
				// 4. 如果当前没有数据赋值默认值
        if (!todayInfo.reportPagesInfo || !todayInfo.reportPagesInfo.pageSizes) {
            todayInfo.reportPagesInfo = { pageSizes: [0] };
        }
        const currentPageSizesArr = todayInfo.reportPagesInfo.pageSizes;
        const currentPageIndex = currentPageSizesArr.length - 1;
        const currentPageSize = currentPageSizesArr[currentPageIndex];
        const needNewPage =
            currentPageSize > 0 &&
            currentPageSize + logSize > DEFAULT_SINGLE_PAGE_MAX_SIZE;
        const nextPageSizesArr = (function (): number[] {
            const arrCopy = currentPageSizesArr.slice();
          	// 5. 如果当前页超过了一页面的最大容量 新增一页
            if (needNewPage) {
                arrCopy.push(logSize);
            } else {
                arrCopy[currentPageIndex] += logSize;
            }
            return arrCopy;
        })();
				// 6. 添加单条数据
        const logItem: LoganLogItem = {
            [LOG_DETAIL_REPORTNAME_INDEX]: this.logReportNameFormatter(
                today,
                needNewPage ? currentPageIndex + 1 : currentPageIndex
            ),
            [LOG_DETAIL_CREATETIME_INDEX]: +now,
            logSize,
            logString
        };
        const updatedTodayInfo: LoganLogDayItem = {
            [LOG_DAY_TABLE_PRIMARY_KEY]: today,
            totalSize: todayInfo.totalSize + logSize,
            reportPagesInfo: {
                pageSizes: nextPageSizesArr
            }
        };
        // The expire time is the start of the day after 7 days.
				// 7. 添加截止日期并存储
        const durationBeforeExpired =
            DEFAULT_LOG_DURATION - (+new Date() - getStartOfDay(new Date()));
				// 8. addItems 为 idb-manager 数据
        await this.DB.addItems([
            {
                tableName: LOG_DAY_TABLE_NAME,
                item: updatedTodayInfo,
                itemDuration: durationBeforeExpired
            },
            {
                tableName: LOG_DETAIL_TABLE_NAME,
                item: logItem,
                itemDuration: durationBeforeExpired
            }
        ]);
    }
    /**
     * Delete reported pages of logDay, in case that new pages are added after last report.
     */
    // 删除日志
    async incrementalDelete (logDay: string, reportedPageIndexes: number[]): Promise<void> {
      // 获取该天数据  
      const dayInfo: LoganLogDayItem | null = await this.getLogDayInfo(logDay);
        if (dayInfo && dayInfo.reportPagesInfo && dayInfo.reportPagesInfo.pageSizes instanceof Array) {
            // 1. 当前总数组
          	const currentPageSizesArr = dayInfo.reportPagesInfo.pageSizes;
          	// 2. 全部日志大小
            const currentTotalSize = dayInfo.totalSize;
          	// 3. 上报过的日志大小
            const totalReportedSize = currentPageSizesArr.reduce((accSize, currentSize, indexOfPage) => {
                if (reportedPageIndexes.indexOf(indexOfPage) >= 0) {
                    return accSize + currentSize;
                } else {
                    return accSize;
                }
            }, 0);
          	// 4. 如果在最后一页也被上报了 追加 0
            const pageSizesArrayWithNewPage = (function addNewPageIfLastPageIsReported (): number[] {
                // Add a new page with 0 page size if the last page is reported.
                if (reportedPageIndexes.indexOf(currentPageSizesArr.length - 1) >= 0) {
                    return currentPageSizesArr.concat([0]);
                } else {
                    return currentPageSizesArr;
                }
            })();
          	
          	// 5. 如果上报过了 size 设置为 0
            const resetReportedPageSizes = pageSizesArrayWithNewPage.reduce((accSizesArray, currentSize, index) => {
                if (reportedPageIndexes.indexOf(index) >= 0) {
                    return accSizesArray.concat([0]); // Reset to 0 if this page is reported.
                } else {
                    return accSizesArray.concat([currentSize]);
                }
            }, [] as number[]);
            // Update dayInfo with new pageSizeArray and new totalSize
            const updatedDayInfo = {
                ...dayInfo,
                reportPagesInfo: {
                    pageSizes: resetReportedPageSizes
                },
                totalSize: Math.max(currentTotalSize - totalReportedSize, 0)
            };
            // The expire time is the start of the day after 7 days.
            const durationBeforeExpired = DEFAULT_LOG_DURATION - (+new Date() - getStartOfDay(new Date())) - (getStartOfDay(new Date()) - dayFormat2Date(logDay).getTime());
            await this.DB.addItems([
                {
                    tableName: LOG_DAY_TABLE_NAME,
                    item: updatedDayInfo,
                    itemDuration: durationBeforeExpired
                }
            ]);
            // Delete logs of reported pages by iterating reportedPageIndexes.
            for (const pageIndex of reportedPageIndexes) {
                await this.DB.deleteItemsInRange([
                    {
                        tableName: LOG_DETAIL_TABLE_NAME,
                        indexRange: {
                            indexName: LOG_DETAIL_REPORTNAME_INDEX,
                            onlyIndex: this.logReportNameFormatter(logDay, pageIndex)
                        }
                    }
                ]);
            }
        }
    }
}

```
<a name="vL9Xl"></a>
### logWithEncryption

<br />`src/index.ts`<br />​<br />
```javascript
/**
 * Save one confidential log locally. Before saving, the log content will be encrypted and it is very hard to crack after then.
 * @param content Log content.
 * @param logType Log type.
 */
export function logWithEncryption (content: string, logType: number): void {
    standardLog(content, logType, LogEncryptMode.RSA);
}
```
logWithEncryption 与 log 方法区别在于日志内容一个只是进行了 base64 加密而另一个 RSA 加密。上面已经在代码中说明。<br />

<a name="DKZDn"></a>
### report

<br />`src/index.ts`<br />

```javascript
// ...

function reportParamChecker (reportConfig: ReportConfig): never | void {
    if (!reportConfig) {
        throw new Error('reportConfig needs to be an object');
    }
    const dayFormatDesc = 'is not valid, needs to be YYYY-MM-DD format';
    if (!isValidDay(reportConfig.fromDayString)) {
        throw new Error(`fromDayString ${dayFormatDesc}`);
    }
    if (!isValidDay(reportConfig.toDayString)) {
        throw new Error(`toDayString ${dayFormatDesc}`);
    }
    if (reportConfig.fromDayString > reportConfig.toDayString) {
        throw new Error('fromDayString needs to be no bigger than toDayString');
    }
}

/**
 * Report local logs to the server side.
 *
 * @param reportConfig Config for this report.
 * @returns {Promise<ReportResult>} Reject with an Error if anything goes wrong during the report process. Resolve ReportResult if the process is successful.
 */
export async function report (reportConfig: ReportConfig): Promise<ReportResult> {
  	// 参数校验
    reportParamChecker(reportConfig);
    const reportLogModule = await import(
        /* webpackChunkName: "report_log" */ './report-log'
    );
    return await reportLogModule.default(reportConfig);
}
export default {
  // ...
  report
}
```

<br />`src/report-log.ts`<br />​<br />
```javascript
export default async function reportLog (
    reportConfig: ReportConfig
): Promise<ReportResult> {
  	// 1. 是否支持 IndexedDB
    if (!LoganDB.idbIsSupported()) {
        throw new Error(ResultMsg.DB_NOT_SUPPORT);
    } else {
      	// 2. 是否存在 IndexedDb 实例
        if (!LoganDBInstance) {
            LoganDBInstance = new LoganDB(Config.get('dbName') as
                | string
                | undefined);
        }
      	// 3. 添加执行队列等待上报 log
        return await invokeInQueue(async () => {
          	// 4. 根据开始结束时间获取日志集合
            const logDaysInfoList: LoganLogDayItem[] = await LoganDBInstance.getLogDaysInfo(
                reportConfig.fromDayString,
                reportConfig.toDayString
            );
          	// 5. 已日期为 key 封装上报内容
            const logReportMap: {
                [key: string]: FormattedLogReportName[];
            } = logDaysInfoList.reduce((acc, logDayInfo: LoganLogDayItem) => {
                return {
                    [logDayInfo[
                        LOG_DAY_TABLE_PRIMARY_KEY
                    ]]: logDayInfo.reportPagesInfo ? logDayInfo.reportPagesInfo.pageSizes.map((i, pageIndex) => {
                        return LoganDBInstance.logReportNameFormatter(
                            logDayInfo[LOG_DAY_TABLE_PRIMARY_KEY],
                            pageIndex
                        );
                    }) : [],
                    ...acc
                };
            }, {});
            const reportResult: ReportResult = {};
            const startDate = dayFormat2Date(reportConfig.fromDayString);
            const endDate = dayFormat2Date(reportConfig.toDayString);
          	// 6. 遍历每天分别上报
          	// 24 * 60 * 60 * 1000
            for (
                let logTime = +startDate;
                logTime <= +endDate;
                logTime += ONE_DAY_TIME_SPAN
            ) {
                const logDay = dateFormat2Day(new Date(logTime));
                if (logReportMap[logDay] && logReportMap[logDay].length > 0) {
                    try {
                      	// 7. 遍历所有上报内容 统一 promise 处理
                        const batchReportResults = await Promise.all(
                            logReportMap[logDay].map(reportName => {
                                return getLogAndSend(reportName, reportConfig);
                            })
                        );
                        reportResult[logDay] = { msg: ResultMsg.REPORT_LOG_SUCC };
                        try {
                          	// 8. 删除已上报的内容
                            const reportedPageIndexes = batchReportResults.filter(reportedPageIndex => reportedPageIndex !== null) as number[];
                            if (reportedPageIndexes.length > 0 && reportConfig.incrementalReport) {
                                // Delete logs of reported pages after report.
                                await LoganDBInstance.incrementalDelete(logDay, reportedPageIndexes);
                            }
                        } catch (e) {
                            // Noop if deletion failed.
                        }
                    } catch (e) {
                        reportResult[logDay] = {
                            msg: ResultMsg.REPORT_LOG_FAIL,
                            desc: e.message || e.stack || JSON.stringify(e)
                        };
                    }
                } else {
                    reportResult[logDay] = { msg: ResultMsg.NO_LOG };
                }
            }
            return reportResult;
        });
    }
}
```

<br />getLogAndSend 实现逻辑如下：<br />​<br />
```javascript
async function getLogAndSend (reportName: string, reportConfig: ReportConfig): Promise<number | null> {
    
  	// 1. 根据名称获取 report 日志内容
  	const logItems = await LoganDBInstance.getLogsByReportName(reportName);
    if (logItems.length > 0) {
        const pageIndex = LoganDBInstance.logReportNameParser(reportName).pageIndex;
        const logItemStrings = logItems
            .map(logItem => {
                return encodeURIComponent(logItem.logString);
            });
        const logReportOb = LoganDBInstance.logReportNameParser(reportName);
        const customXHROpts: ReportXHROpts = typeof reportConfig.xhrOptsFormatter === 'function' ? reportConfig.xhrOptsFormatter(logItemStrings, logReportOb.pageIndex + 1, logReportOb.logDay) : {};
        return await Ajax(
            customXHROpts.reportUrl || reportConfig.reportUrl || (Config.get('reportUrl') as string),
            customXHROpts.data || JSON.stringify({
                client: 'Web',
                webSource: `${reportConfig.webSource || ''}`,
                deviceId: reportConfig.deviceId,
                environment: `${reportConfig.environment || ''}`,
                customInfo: `${reportConfig.customInfo || ''}`,
                logPageNo: logReportOb.pageIndex + 1, // pageNo start from 1,
                fileDate: logReportOb.logDay,
                logArray: logItems
                    .map(logItem => {
                        return encodeURIComponent(logItem.logString);
                    })
                    .toString()
            }),
            customXHROpts.withCredentials ?? false,
            'POST',
            customXHROpts.headers || {
                'Content-Type': 'application/json',
                'Accept': 'application/json,text/javascript'
            }
        ).then((responseText: any) => {
            // ...
          	if (response?.code === 200) {
                // 返回已经上报的 log 索引
                return pageIndex;
            }
        });
    } else {
        // Resolve directly if no logs in current page.
        return Promise.resolve(null);
    }
}
```


