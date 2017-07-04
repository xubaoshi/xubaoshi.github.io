---
layout:     post
title:      "2017-07-04-es6-destructuring"
date:       "2017-07-04 "
author:     "XuBaoshi"
header-img: "img/destructuring.jpg"
---

<h1>ECMAScript.6 解构赋值相关</h1>
解构赋值允许你使用类似数组或对象字面量的语法将数组和对象的属性赋给各种变量。这种赋值语法极度简洁，同时还比传统的属性访问方法更为清晰。
<h2>对象的解构赋值</h2>

    let node = {
        type:'Identifier',
        name:'foo'
    };
    let {type,name} = node;
    console.log(type);  // 'Identifier'
    console.log(name);  // 'foo'

上面的代码将node的type属性赋值给了名为type的变量，name属性赋值给了名为name的变量。<br>
<strong>ps:如果使用解构赋值一定要存在实例！如果没有报错如下:</strong> <br>

<img src="/img/es6-destructuring/destructuring1.png" />

    let node = {
        type:'Identifier',
        name:'foo'
    };
    let type = "1";
    let name ="1";

    ({type,name} = node);
    console.log(type);  // "Identifier"
    console.log(name);  // "foo"

上面的代码中可以发现通过解构赋值可以修改已经定义好了的变量的值，这里需要注意的是对象的解构赋值在赋值时一定要用一对括号包裹起来，因为它期望是一条赋值语句。

<h3>默认值</h3>
在使用解构赋值时如果指定的变量不存在被解构的对象中，那么该变量被赋予 undefined.

    let node = {
        type:'Identifier',
        name:'foo'
    };
    let {type,name,value} = node
    console.log(type);  // "Identifier"
    console.log(name);  // "foo"
    console.log(value); // "undefined"

当定义的变量没有从目标对象中解构出所需值时，可以使用默认值代替。

    let node = {
        type:'Identifier',
        name:'foo'
    };
    let {type,name,value=true} = node
    console.log(type);  // "Identifier"
    console.log(name);  // "foo"
    console.log(value); // "true"

<h3>解构变量重命名</h3>
解构的变量名默认与对象属性名相同，如果希望不同，可以使用以下方式修改。

    let node = {
        type:'Identifier',
        name:'foo'
    };
    let {type:nodeType,name:nodeName} = node
    console.log(nodeType);  // "Identifier"
    console.log(nodeName);  // "foo"

    // 默认值与解构变量重命名
    let node = {
        type:'Identifier'
    };
    let {type:nodeType,name:nodeName="bar"} = node
    console.log(nodeType);  // "Identifier"
    console.log(nodeName);  // "foo"

<h3>解构嵌套对象</h3>

    let node = {
        type:'Identifier',
        name:'foo',
        loc:{
            start:{
                line:1,
                column:1
            },
            end:{
                line:1,
                column:4
            }
        }
    }

    let {loc:{start}} = node;
    console.log(start.line);  // '1'
    console.log(start.column);// '1'

    // ps: 下面的代码其实什么也没有做，loc只是用来定位。
    let {loc:{}} = node;

<h2>数组的解构赋值</h2>
数组的结构赋值其实与对象的解构赋值很相似，仅仅是字面量的语法不同。

    let colors = ['red','green','blue'];
    let [firstColor,secondColor] = colors;
    console.log(firstColor);  // "red"
    console.log(secondColor); // "green"

由上可知数组解构赋值的顺序是由数组的索引值决定的。

    // 如果不想解析可以使用","将其分割
    let colors = ['red','green','blue'];
    let [,,thirdColor] = colors;
    console.log(thirdColor); // "blue"

    // 效果同对象解构
    let colors = ['red','green','blue'];
    let firstColor = "22";
    let secondColor= "33";
    [firstColor,secondColor] = colors;
    console.log(firstColor); // "red"
    console.log(secondColor); // "green"

<h3>交换变量值</h3>

    // es5
    let a = 1,b = 2,temp;
    temp = a;
    a=b;
    b=temp;
    console.log(a);  // "2"
    console.log(b);  // "1"

    // es6
    let a = 1,b = 2;
    [a,b] = [b,a];
    console.log(a);  // "2"
    console.log(b);  // "1"

<h3>默认值</h3>

    let colors = ['red'];
    let [firstColor,secondColor='green'] = colors;
    console.log(firstColor); // "red"
    console.log(secondColor);// "green"

<h3>嵌套数组</h3>

    // 方式与对象解构类似
    let colors = [ "red", [ "green", "lightgreen" ], "blue" ];
    let [ firstColor, [ secondColor ] ] = colors;
    console.log(firstColor); // "red"
    console.log(secondColor); // "green"

<h3>剩余成员(Rest Items)</h3>
通过使用'...'(展开运算符)可以讲解构后剩余的成员放入一个数组变量中。

    let colors = [ "red", "green", "blue" ];
    let [ firstColor, ...restColors ] = colors;
    console.log(firstColor); // "red"
    console.log(restColors); // ["green","blue"]
    console.log(restColors[0]); // "green"
    console.log(restColors[1]); // "blue"

<h2>混合解构</h2>

    let node = {
        type: "Identifier",
        name: "foo",
        loc: {
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 4
            }
        },
        range: [0, 3]
    };

    let {
        loc:{start},
        range:[startIndex]
    } = node;
    console.log(start.line); // "1"
    console.log(start.column); // "1"
    console.log(startIndex); // "0"

<h2>函数参数解构</h2>
回头来看一下函数默认值的相关描述。

    function makeRequest(url,timeout=2000,callback=function(){}){
		console.log(timeout);
	}
    makeRequest("/index",null);   // null
    makeRequest("/index",undefined); // 2000

上述代码中如果timeout赋值为undefined才会使用默认值，也就是说判断默认值是否生效的是参数是否===undefined，而不是==undefined

    // eg1
    function move({x = 0, y = 0} = {}) {
           return [x, y];
    }
    console.log(move({x: 3, y: 8}));// [3, 8]
    console.log(move({x: 3}));// [3, 0]
    console.log(move({}));// [0, 0]
    console.log(move());// [0, 0]

    // eg2
    function move({x, y} = { x: 0, y: 0 }) {
        return [x, y];
    }
    console.log(move({x: 3, y: 8})); // [3, 8]
    console.log(move({x: 3})); // [3, undefined]
    console.log(move({})); // [undefined, undefined]
    console.log(move()); // [0, 0]

从上述两份代码来看eg1是给变量x,y指定默认值，而eg2是给函数的参数指定默认值。
<h3>eg1</h3>
<ol>
    <li>
    eg1中当参数为{x: 3, y: 8}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性不存在undefined，故变量x，y的值采用参数的属性结果为[3, 8]。
    </li>
    <li>
    eg1中当参数为{x: 3}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性y为undefined，故变量x的值采用参数的属性，变量y采用解构默认值0，结果为 [3, 0]。
    </li>
    <li>
        eg1中当参数为{}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性x、y为undefined，故变量x、y采用解构默认值0，结果为 [0, 0]。
    </li>
    <li>
    eg1中当参数为undefined时，函数参数采用默认值{}，在解析函数参数时由于参数对象属性x、y为undefined，故变量x、y采用解构默认值0，结果为 [0, 0]。
    </li> 
</ol>

<h3>eg2</h3>
<ol>
    <li>eg2中当参数为{x: 3, y: 8}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性不存在undefined，故变量x，y的值采用参数的属性结果为[3, 8]。</li>
    <li>
        eg2中当参数为{x: 3}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性y为undefined，故变量x的值采用参数的属性，但变量y没有默认值解析为undefined，结果为 [3, undefined]。
    </li>
    <li>
         eg1中当参数为{}时，函数参数不采用默认值，在解析函数参数时由于参数对象属性x、y为undefined，但变量x、y都没有默认值解析为undefined，结果为 [undefined, undefined]。
    </li>
    <li>
        eg1中当参数为undefined时，函数参数采用默认值{ x: 0, y: 0 }，在解析函数参数时由于参数对象属性x、y为0，故变量x、y采用解构默认值0，结果为 [0, 0]。
    </li>
</ol>
<br>
<strong><a href="http://www.infoq.com/cn/articles/es6-in-depth-destructuring/" target="_blank">参考连接</a></strong>
