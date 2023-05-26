# js手写源码

## 防抖

```js
function debounce(func, ms = 1000) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, ms)
  }
}

// 测试
const task = () => { console.log('run task') }
const debounceTask = debounce(task, 1000)
window.addEventListener('scroll', debounceTask)
```

## 节流

```js
function throttle(func, ms = 1000) {
  let canRun = true
  return function (...args) {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      func.apply(this, args)
      canRun = true
    }, ms)
  }
}

// 测试
const task = () => { console.log('run task') }
const throttleTask = throttle(task, 1000)
window.addEventListener('scroll', throttleTask)
```

## new操作符

```js
function myNew(Func, ...args) {
  const instance = {};
  if (Func.prototype) {
    Object.setPrototypeOf(instance, Func.prototype)
  }
  const res = Func.apply(instance, args)
  if (typeof res === "function" || (typeof res === "object" && res !== null)) {
    return res
  }
  return instance
}

// 测试
function Person(name) {
  this.name = name
}
Person.prototype.sayName = function() {
  console.log(`My name is ${this.name}`)
}
const me = myNew(Person, 'Jack')
me.sayName()
console.log(me)
```

## bind操作符

```js
Function.prototype.myBind = function (context = globalThis) {
  const fn = this
  const args = Array.from(arguments).slice(1)
  const newFunc = function () {
    const newArgs = args.concat(...arguments)
    if (this instanceof newFunc) {
      // 通过 new 调用，绑定 this 为实例对象
      fn.apply(this, newArgs)
    } else {
      // 通过普通函数形式调用，绑定 context
      fn.apply(context, newArgs)
    }
  }
  // 支持 new 调用方式
  newFunc.prototype = Object.create(fn.prototype)
  return newFunc
}

// 测试
const me = { name: 'Jack' }
const other = { name: 'Jackson' }
function say() {
  console.log(`My name is ${this.name || 'default'}`);
}
const meSay = say.bind(me)
meSay()
const otherSay = say.bind(other)
otherSay()
```

## call操作符

```js
Function.prototype.myCall = function (context = globalThis) {
  // 关键步骤，在 context 上调用方法，触发 this 绑定为 context，使用 Symbol 防止原有属性的覆盖
  const key = Symbol('key')
  context[key] = this
  let args = [].slice.call(arguments, 1)
  let res = context[key](...args)
  delete context[key]
  return res
};

// 测试
const me = { name: 'Jack' }
function say() {
  console.log(`My name is ${this.name || 'default'}`);
}
say.myCall(me)
```

## apply操作符

```js
Function.prototype.myApply = function (context = globalThis) {
  // 关键步骤，在 context 上调用方法，触发 this 绑定为 context，使用 Symbol 防止原有属性的覆盖
  const key = Symbol('key')
  context[key] = this
  let res
  if (arguments[1]) {
    res = context[key](...arguments[1])
  } else {
    res = context[key]()
  }
  delete context[key]
  return res
}

// 测试
const me = { name: 'Jack' }
function say() {
  console.log(`My name is ${this.name || 'default'}`);
}
say.myApply(me)
```

## deepCopy

```js
function deepCopy(obj, cache = new WeakMap()) {
  if (!obj instanceof Object) return obj
  // 防止循环引用
  if (cache.get(obj)) return cache.get(obj)
  // 支持函数
  if (obj instanceof Function) {
    return function () {
      obj.apply(this, arguments)
    }
  }
  // 支持日期
  if (obj instanceof Date) return new Date(obj)
  // 支持正则对象
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  // 还可以增加其他对象，比如：Map, Set等，根据情况判断增加即可，面试点到为止就可以了

  // 数组是 key 为数字素银的特殊对象
  const res = Array.isArray(obj) ? [] : {}
  // 缓存 copy 的对象，用于处理循环引用的情况
  cache.set(obj, res)

  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Object) {
      res[key] = deepCopy(obj[key], cache)
    } else {
      res[key] = obj[key]
    }
  });
  return res
}

// 测试
const source = {
  name: 'Jack',
  meta: {
    age: 12,
    birth: new Date('1997-10-10'),
    ary: [1, 2, { a: 1 }],
    say() {
      console.log('Hello');
    }
  }
}
source.source = source
const newObj = deepCopy(source)
console.log(newObj.meta.ary[2] === source.meta.ary[2]);
```

## 事件总线 | 发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.cache = {}
  }

  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn)
    } else {
      this.cache[name] = [fn]
    }
  }

  off(name, fn) {
    const tasks = this.cache[name]
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn)
      if (index >= 0) {
        tasks.splice(index, 1)
      }
    }
  }

  emit(name) {
    if (this.cache[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      const tasks = this.cache[name].slice()
      for (let fn of tasks) {
        fn();
      }
    }
  }

  emit(name, once = false) {
    if (this.cache[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      const tasks = this.cache[name].slice()
      for (let fn of tasks) {
        fn();
      }
      if (once) {
        delete this.cache[name]
      }
    }
  }
}

// 测试
const eventBus = new EventEmitter()
const task1 = () => { console.log('task1'); }
const task2 = () => { console.log('task2'); }
eventBus.on('task', task1)
eventBus.on('task', task2)

setTimeout(() => {
  eventBus.emit('task')
}, 1000)
```

## 函数柯里化

理解：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

```js
function curry(func) {
  return function curried(...args) {
    // 关键知识点：function.length 用来获取函数的形参个数
    // 补充：arguments.length 获取的是实参个数
    if (args.length >= func.length) {
      return func.apply(this, args)
    }
    return function (...args2) {
      return curried.apply(this, args.concat(args2))
    }
  }
}

// 测试
function sum (a, b, c) {
  return a + b + c
}
const curriedSum = curry(sum)
console.log(curriedSum(1, 2, 3))
console.log(curriedSum(1)(2,3))
console.log(curriedSum(1)(2)(3))
```

## 迭代器的封装实现

```js
function createArrIterator(arr) {
  let index = 0

  let _iterator = {
    next() {
      if (index < arr.length) {
        return { done: false, value: arr[index++] }
      }

      return { done: true, value: undefined }
    }
  }

  return _iterator
}
// 测试
const bears = ['ice', 'panda', 'grizzly']
let iter = createArrIterator(bears)
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
```

```js
const nickName = 'ice'
//字符串的Symbol.iterator方法
const strIter = nickName[Symbol.iterator]()

console.log(strIter.next()) // { value: "i", done: false }
console.log(strIter.next()) // { value: "c", done: false }
console.log(strIter.next()) // { value: "e", done: false }
console.log(strIter.next()) // { value: undefined, done: true }
```

