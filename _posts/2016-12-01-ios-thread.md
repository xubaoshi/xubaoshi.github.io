---
layout:     post
title:      "ios thread learn"
date:       "2016-12-01 19:52:00"
author:     "XuBaoshi"
header-img: "img/home-bg.jpg"
---

## ios thread learn ##
1. pThread
2. NSThread
3. GCD
4. NSOperation

### pThread ###
基于c++框架，多平台
	
	// oc 
	pthread_t pthread;
	NSLog(@"我在主线程中执行！");
	phread_create(&pthread,NULL,run,NULL);  // 创建线程
	
	void *run(void *data){
		NSLog(@"我在子线程中执行！");
		return NULL;
	}

![](http://i.imgur.com/Wp0qGLG.png)<br>

从图中可以看出当前进程号及线程号。两个log方法在相同的进程中不同的线程下执行。

### NSThread ###

	// oc
	// NSThread创建线程三种方法（三选一）

	// 1.通过alloc init的方式创建线程执行线程）
	NSLog(@"我在主线程中执行！");
	NSThread *thread1 = [[NSThread alloc] initWithTarget:self selector:@selector(runThread) object:nil];
	// 开始线程
	[thread1 start];
	
	// 2.通过detachNewThreadSelecor 方式创建线程
	[NSThread detachNewThreadSelecor:@selector(runThread) toTarget:self withObject:nil]; 

	// 3.通过performSelectorInBackground 方式创建线程
	[self performSelectorInBackground:@selector(runThread) withObject:nil];

	// 线程方法
	 -(void) runThread {
		NSLog(@"我在子线程中执行！");
		// 回到主线程执行
		[self performSelectOnMainThread:@selector(runMainThread) withObject:nil waitUntilDone:YES];
	 }
	
	// 主线程方法
	 -void runMainThread {
		NSLog(@"回到主线程执行！");
	 }

![](http://i.imgur.com/TZEEBwT.jpg)<br>

第一种方式需要调用线程对象的start方法执行线程而其他两种直接开启线程。

	// 第一种方法
	// 设置线程名称
	[thread1 setName:@"Name_Thread1"];
	// 获得线程name
	[NSThread currentThread].name;
	// 优先级(double)
	[thread1 setThreadPriority:0.5]

![](http://i.imgur.com/4gLrvpJ.jpg)


### GCD ###
苹果提出的更加有效的利用多核CPU的技术，线程自动管理如：创建线程、任务调度、销毁线程等，使用更加方便和灵活。<br>

#### 简单使用方法 ####
同步及异步任务：<br>
串行及并行任务：<br>

	// dispatch_get_main_queue & dispatch_get_global_queue
	// oc
	 -(void) clickGCD {
		NSLog(@"执行GCD");
		dispatch_async(dispatch_get_global_queue(0,0),^{
			// 执行耗时任务(代码忽略)
			NSLog(@"start task 1");
			dispatch_async(dispatch_get_main_queue(),^{
				// 回到主线程刷新UI
				NSLog(@"刷新UI");
			})
		})
	}

![](http://i.imgur.com/5EyZgTr.png)

存储数据库及同步图片都可以采取此种方式。

    // dispatch_get_global_queue是一个全局并发的queue

	dispatch_async(dispatch_get_global_queue(0,0),^{
			NSLog(@"start task 1");
			[NSThread sleepForTimeInterval:2];
			NSLog(@"end task 1");
	});

	dispatch_async(dispatch_get_global_queue(0,0),^{
			NSLog(@"start task 2");
			[NSThread sleepForTimeInterval:2];
			NSLog(@"end task 2");
	});

	dispatch_async(dispatch_get_global_queue(0,0),^{
			NSLog(@"start task 3");
			[NSThread sleepForTimeInterval:2];
			NSLog(@"end task 3");
	});

![](http://i.imgur.com/yT9FSnB.png)

	// 设置线程优先级
	dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW,0),^{
			NSLog(@"start task 1");
			[NSThread sleepForTimeInterval:2];
			NSLog(@"end task 1");
	});

	dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH,0),^{
			NSLog(@"start task 1");
			[NSThread sleepForTimeInterval:2];
			NSLog(@"end task 1");
	});

![](http://i.imgur.com/8xJ9UIJ.png)

如果保证执行顺序，需要使用串行执行。
	
	// 自定义queue
	// DISPATCH_QUEUE_SERIAL == NULL
	dispatch_queue_t queue = dispatch_queue_create("com.test.gcd.queue",NULL);
	dipatch_async(queue,^{
		NSLog(@"start task 1");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 1");
	});

	dipatch_async(queue,^{
		NSLog(@"start task 2");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 2");
	});

	dipatch_async(queue,^{
		NSLog(@"start task 3");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 3");
	});

线程ID相同即上述代码单线程执行3个任务，没有实现多线程执行条件。<br>
![](http://i.imgur.com/jmDvSGR.png)
	
	// 上段代码创建线程更换参数 DISPATCH_QUEUE_CONCURRENT
	dispatch_queue_t queue = dispatch_queue_create("com.test.gcd.queue",DISPATCH_QUEUE_CONCURRENT);


![](http://i.imgur.com/0W4Dka2.png)
		
线程ID不同即上述代码3个线程分别执行3个任务。

#### GCD_Group ####
多个任务异步处理的时候,有的时候需要告诉程序所有的任务已经执行完毕，当得知所有任务执行完成后会调用回调函数执行其他任务。
	
	// 创建并行queue
	dispatch_queue_t queue = dispatch_queue_t queue = dispatch_queue_create("com.test.gcd.group",DISPATCH_QUEUE_CONCURRENT);
	
	dispatch_group_t group = dispatch_group_create();
	 
	dispatch_group_async(group,queue, ^{
		NSLog(@"start task 1");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 1");
	});

	dispatch_group_async(group,queue, ^{
		NSLog(@"start task 2");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 2");
	});

	dispatch_group_async(group,queue, ^{
		NSLog(@"start task 3");
		[NSThread sleepForTimeInterval:2];
		NSLog(@"end task 3");
	});
	
	dispatch_group_notify(group,queue,^{
		NSLog(@"All tasks over");
	});
	
	// 回到主线程执行回调
	dispatch_group_notify(group,queue,^{
		NSLog(@"All tasks over");
		dispatch_async(			
			NSLog(@"回到主线程刷新UI");
		});
	});


![](http://i.imgur.com/hyN5hVk.png)

回调最后一个线程task3所对应的线程，没有单独开辟一个线程去执行回调任务，如果希望回到主线程执行调用回到主线程所对应的方法。
	
	// 异步请求 dispatch_group_enter 及 dipatch_group_leave 同时出现
	dispatch_group_t group = dispatch_group_create();
	dispatch_group_enter(group);
	[self sendRequest:^{
		NSLog(@"request done!")
		dipatch_group_leave(group)
	}];
<br>
#### GCD 单例模式及延迟执行 ####
**单例模式**

	 + (instancetype) instance{
		 static dispatch_once_t onceToken;
		 static TestSingle *ins = nil;
		 dispatch_once(&onceToken,^{
			NSLog(@"init the TestSingle")
			ins = [[TestSingle alloc] init];
		 })
		return ins;
	 }

		
	// 使用
	  -（void）clickSingle {
		TestSingle *single = [TestSingle instance];
		NSLog(@"%@",single);
	  }

![](http://i.imgur.com/VCsM0Ll.jpg)

执行多次clickSingle方法后“init the TestSingle” 只执行一次，即单例模式执行完之后，如果不销毁一直会存在会内存中。<br>
**延迟执行**
	
	// 使用
	NSLog(@"----begin----")
	  -（void）clickSingle {
		// DISPATCH_TIME_NOW（当前时间） NSEC_PER_SEC（每秒） dispatch_get_main_queue（在主线程中执行）
		dispatch_after(dispatch_time(DISPATCH_TIME_NOW,(int64_t)(2*NSEC_PER_SEC)),dispatch_get_main_queue(),^{
			NSLog(@"delay excute");
		})
	  }

![](http://i.imgur.com/jaInH4J.png)

弊端是方法一旦执行不能够取消掉。

### NSOperation ###
NSOperation是GCD的一种封装，封装了实例执行的操作及数据，能够以并发或非并发的方式执行操作。
通过使用NSOperation子类来调用其内部的方法。<br>
1.NSInvocationOperation & NSBlockOperation (自带方法)<br>
2.自定义类继承NSOperation<br><br>
**NSInvocationOperation**<br>

		// 非并发执行
		-(void) operationTest {
			NSInvocationOperation *invocationOper = [[NSInvocationOperation alloc] initWithTarget:self selector:@selector(invocationAction) object:nil]; 
			[invocationOper start];
		}

		// 并发执行
		-(void) operationTest {
			NSLog(@"main thread");
			dispatch_async(dispatch_get_global_queue(0,0),^{
				NSInvocationOperation *invocationOper = [[NSInvocationOperation alloc] initWithTarget:self selector:@selector(invocationAction) object:nil];
				[invocationOper start];
			})
			NSLog(@"end");
			
		}
		
		-(void) invocationAction {
			for (int i=0;i<3;i++){
				NSLog(@"invocation %d",i);
				[NSTread sleepForTimeInterval：1]；
			}
		}

非并发执行<br>
![](http://i.imgur.com/af62loo.jpg)<br>
并发执行<br>
![](http://i.imgur.com/lS4g0HR.jpg)<br>

**NSBlockOperation**<br>

		-(void) operationTest {
			NSLog(@"main thread");
			dispatch_async(dispatch_get_global_queue(0,0),^{
				
				NSBlockOperation *blockOper = [NSBlockOperation blockOperationWithBlock:^{
					for (int i=0;i<3;i++){
						NSLog(@"invocation %d",i);
						[NSTread sleepForTimeInterval：1]；
					}
				}];
		
				[blockOper start];
			})
		}
		
![](http://i.imgur.com/6jMZAgP.png)

**相关概念：**<br>
NSOperationQueue 可以理解成线程池，创建线程后可以将线程添加至队列中。
	
	a.addOperation // 添加至线程池
	b.setMaxCouncurrentOperationCount // 设置最大并发数

	// 创建NSOperationQueue
	@property (nonatomic,strong) NSOperationQueue *operQueue;

	if(!self.operQueue) {
		self.operQueue = [[NSOperationQueue alloc] init];
	}
	
	// 上述代码创建的线程
	[self.operQueue addOperation:blockOper];


状态<br>
ready、cancelled、executing、finished、asynchronous

一旦线程执行无法cancelled，可以在代码内部判断<br>
	
依赖-addDependency

	// 创建NSOperationQueue
	@property (nonatomic,strong) NSOperationQueue *operQueue;

	NSBlockOperation *customOperA = [NSBlockOperation blockOperationWithBlock:^{
		for (int i=0;i<3;i++){
			NSLog(@"OperA %d",i);
			[NSTread sleepForTimeInterval：1]；
		}
	}];

	NSBlockOperation *customOperB = [NSBlockOperation blockOperationWithBlock:^{
		for (int i=0;i<3;i++){
			NSLog(@"OperB %d",i);
			[NSTread sleepForTimeInterval：1]；
		}
	}];

	NSBlockOperation *customOperC = [NSBlockOperation blockOperationWithBlock:^{
		for (int i=0;i<3;i++){
			NSLog(@"OperC %d",i);
			[NSTread sleepForTimeInterval：1]；
		}
	}];

	NSBlockOperation *customOperD = [NSBlockOperation blockOperationWithBlock:^{
		for (int i=0;i<3;i++){
			NSLog(@"OperD %d",i);
			[NSTread sleepForTimeInterval：1]；
		}
	}];
	
	// 不要循环依赖
	[customOperD addDependency:customOperA];
	[customOperA addDependency:customOperC];
	[customOperC addDependency:customOperB];
	
	// 添加线程池
	[self.operQueue addOperation:customOperA];
	[self.operQueue addOperation:customOperB];
	[self.operQueue addOperation:customOperC];
	[self.operQueue addOperation:customOperD];

![](http://i.imgur.com/Smuw8gv.jpg)

### 线程锁 ###
	
	// synchronized oc
	@synchronized(self) {
		// 执行代码段
	}

	// NSCondition oc
	@property (nonatomic,strong) NSCondition *condition
	self.condition = [[NSCondition alloc] init];
	
	[self.condition lock];
	// 执行代码段
	[self.condition unlock];