先从coroutine说起

coroutine是一种常见的流程控制语句, 可以在单线程内模拟多线程的执行, 经常被用于非抢占式用户态纤程(Fiber) 这里先要区分一下两种不同的coroutine

stackless coroutine (semi-coroutine)

stackful coroutine (coroutine)

stackless coroutine又经常被称为generator. 下面这些语言中的yield都属于stackless coroutine

javascript 1.7

python

ruby

本文主要是讲解yield的本质及其实现原理, 对于yield比较陌生的同学可以先简单学习一下javascript 1.7的文档: https://developer.mozilla.org/en/New_in_JavaScript_1.7#Generators

stackless coroutine本质上仅仅是一个语法糖, 例如下面这段javascript代码, 可以转换成不使用yield的代码: function fib() {

var i = 0, j = 1;

while (true) {

```
yield i;

var t = i;

i = j;

j += t;
```

}

}

首先把while/for循环转换成递归, 并且新建一个generator对象: function fib() {

var generator = {};

generator.next = function () {

```
var i = 0, j = 1;

var $while = function () {

  yield i;

  var t = i;

  i = j;

  j += t;

  $while();

  / 1 /

}

$while();

/ 2 /
```

}

return generator;

}

然后对generator内部做cps变换. 经过cps变换后, yield成为一个普通函数: function fib() {

var generator = {};

var $yield = function (k, value) {

```
generator.next = k;

return value;
```

};

generator.next = function () {

```
var i = 0, j = 1;

var $while = function (k / $while never return, so k is never called. /) {

  return $yield(function () {

    // all statements after yield become continuation of yield, which comes into this function

    var t = i;

    i = j;

    j += t;

    return $while(function () { / 1 / });

  }, i / arguments of yield /);

};

return $while(function () { / 2 / });
```

}

return generator;

}

// test code, copy into any javascript engine and check result

var g = fib();

for (var i = 0; i < 10; i++) {

console.log(g.next());

}

上面所使用到了两种转换:

循环变递归

CPS变换

这两种转换都是通用转换, 任何程序都可以做这样的转换, 通过这两种转换可以把任何使用yield的代码转换成普通代码. 实际上, stackless coroutine的实现就是编译器(或者解释器)在背后做了这些工作.
