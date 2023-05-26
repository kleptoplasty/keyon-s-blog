# 前端错误捕获

> 本文参考：[https://juejin.cn/post/6987681953424080926](https://juejin.cn/post/6987681953424080926)

## 错误类型

### 常见JS执行错误

1. SyntaxError

> 解析时发生语法错误

```js
// 控制台运行
const xx,
```

window.onerror捕获不到SyntxError，一般SyntaxError在构建阶段，甚至本地开发阶段就会被发现。

2. TypeError

> 值不是所期待的类型

```js
// 控制台运行
const person = void 0
person.name
```

3. ReferenceError

> 引用未声明的变量

```js
// 控制台运行
nodefined
```

4. RangeError

> 当一个值不在其所允许的范围或者集合中

```js
(function fn ( ) { fn() })()
```

### 网络错误

1. ResourceError

> 资源加载错误

```js
new Image().src = '/remote/image/notdeinfed.png'
```

2. HttpError

> Http请求错误

```js
// 控制台运行
fetch('/remote/notdefined', {})
```



## 错误捕获方式

### try/catch

> 能捕获常规运行时错误，语法错误和异步错误不行

```js
// 常规运行时错误，可以捕获 ✅
try {
  console.log(notdefined);
} catch(e) {
  console.log('捕获到异常：', e);
}

// 语法错误，不能捕获 ❌
try {
  const notdefined,
} catch(e) {
  console.log('捕获到异常：', e);
}

// 异步错误，不能捕获 ❌
try {
  setTimeout(() => {
    console.log(notdefined);
  }, 0)
} catch(e) {
  console.log('捕获到异常：',e);
}
```

### window.onerror

> pure js错误收集，window.onerror，当 JS 运行时错误发生时，window 会触发一个 ErrorEvent 接口的 error 事件。

```js
/**
* @param {String}  message    错误信息
* @param {String}  source    出错文件
* @param {Number}  lineno    行号
* @param {Number}  colno    列号
* @param {Object}  error  Error对象
*/

window.onerror = function(message, source, lineno, colno, error) {
   console.log('捕获到异常：', {message, source, lineno, colno, error});
}
```

### window.addEventListener

> 当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 Event 接口的 error 事件，这些 error 事件不会向上冒泡到 window，但能被捕获。而window.onerror不能监测捕获。

```js
// 图片、script、css加载错误，都能被捕获 ✅
<script>
  window.addEventListener('error', (error) => {
     console.log('捕获到异常：', error);
  }, true)
</script>
<img src="https://yun.tuia.cn/image/kkk.png">
<script src="https://yun.tuia.cn/foundnull.js"></script>
<link href="https://yun.tuia.cn/foundnull.css" rel="stylesheet"/>
  
// new Image错误，不能捕获 ❌
<script>
  window.addEventListener('error', (error) => {
    console.log('捕获到异常：', error);
  }, true)
</script>
<script>
  new Image().src = 'https://yun.tuia.cn/image/lll.png'
</script>

// fetch错误，不能捕获 ❌
<script>
  window.addEventListener('error', (error) => {
    console.log('捕获到异常：', error);
  }, true)
</script>
<script>
  fetch('https://tuia.cn/test')
</script>
```

### Promise错误

1. 普通Promise错误

```js
// try/catch 不能处理 JSON.parse 的错误，因为它在 Promise 中
try {
  new Promise((resolve,reject) => { 
    JSON.parse('')
    resolve();
  })
} catch(err) {
  console.error('in try catch', err)
}

// 需要使用catch方法
new Promise((resolve,reject) => { 
  JSON.parse('')
  resolve();
}).catch(err => {
  console.log('in catch fn', err)
})
```

2. async错误

> try/catch不能捕获async包裹的错误

```js
const getJSON = async () => {
  throw new Error('inner error')
}

// 通过try/catch处理
const makeRequest = async () => {
    try {
        // 捕获不到
        JSON.parse(getJSON());
    } catch (err) {
        console.log('outer', err);
    }
};

try {
    // try/catch不到
    makeRequest()
} catch(err) {
    console.error('in try catch', err)
}

try {
    // 需要await，才能捕获到
    await makeRequest()
} catch(err) {
    console.error('in try catch', err)
}
```

3. import chunk错误

> import其实返回的也是一个promise，因此使用如下两种方式捕获错误

```js
// Promise catch方法
import(/* webpackChunkName: "incentive" */'./index').then(module => {
    module.default()
}).catch((err) => {
    console.error('in catch fn', err)
})

// await 方法，try catch
try {
    const module = await import(/* webpackChunkName: "incentive" */'./index');
    module.default()
} catch(err) {
    console.error('in try catch', err)
}
```

以上三种其实归结为Promise类型错误，可以通过unhandledrejection捕获

```js
// 全局统一处理Promise
window.addEventListener("unhandledrejection", function(e){
  console.log('捕获到异常：', e);
});
fetch('https://tuia.cn/test')
```

为了防止有漏掉的 Promise 异常，可通过unhandledrejection用来全局监听Uncaught Promise Error。

### Vue错误

> 由于Vue会捕获所有Vue单文件组件或者Vue.extend继承的代码，所以在Vue里面出现的错误，并不会直接被window.onerror捕获，而是会抛给Vue.config.errorHandler。

```js
/**
 * 全局捕获Vue错误，直接扔出给onerror处理
 */
Vue.config.errorHandler = function (err) {
  setTimeout(() => {
    throw err
  })
}
```

### React错误

> react 通过componentDidCatch，声明一个错误边界的组件

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

class App extends React.Component {
   
  render() {
    return (
    <ErrorBoundary>
      <MyWidget />
    </ErrorBoundary>  
    )
  }
}
```

但error boundaries并不会捕捉以下错误：React事件处理，异步代码，error boundaries自己抛出的错误。

### 跨域问题

> 一般情况，如果出现 Script error 这样的错误，基本上可以确定是出现了跨域问题。

如果当前投放页面和云端JS所在不同域名，如果云端JS出现错误，window.onerror会出现Script Error。通过以下两种方法能给予解决。

- 后端配置Access-Control-Allow-Origin、前端script加crossorigin。

```js
<script src="http://yun.tuia.cn/test.js" crossorigin></script>

const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = 'http://yun.tuia.cn/test.js';
document.body.appendChild(script);
```

- 如果不能修改服务端的请求头，可以考虑通过使用 try/catch 绕过，将错误抛出。

```html
<!doctype html>
<html>
<head>
  <title>Test page in http://test.com</title>
</head>
<body>
  <script src="https://yun.dui88.com/tuia/cdn/remote/testerror.js"></script>
  <script>
  window.onerror = function (message, url, line, column, error) {
    console.log(message, url, line, column, error);
  }

  try {
    foo(); // 调用testerror.js中定义的foo方法
  } catch (e) {
    throw e;
  }
  </script>
</body>
</html>
```

会发现如果不加try catch，console.log就会打印script error。加上try catch就能捕获到。



## 错误捕获验证

```js
// 常规运行时错误，可以捕获 ✅

window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到异常：',{message, source, lineno, colno, error});
}
console.log(notdefined);

// 语法错误，不能捕获 ❌
window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到异常：',{message, source, lineno, colno, error});
}
const notdefined,
      
// 异步错误，可以捕获 ✅
window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到异常：',{message, source, lineno, colno, error});
}
setTimeout(() => {
  console.log(notdefined);
}, 0)

// 资源错误，不能捕获 ❌
<script>
  window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到异常：',{message, source, lineno, colno, error});
  return true;
}
</script>
<img src="https://yun.tuia.cn/image/kkk.png">
```

























