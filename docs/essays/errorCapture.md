# Font-end error Capture

> reference：[https://juejin.cn/post/6987681953424080926](https://juejin.cn/post/6987681953424080926)

## Error type

### frequently error type

1. SyntaxError

> Syntax error during parsing

```js
// console operation
const xx,
```

window.onerror cann't capture SyntxError，generally，SyntaxError will be found in the construction phase

2. TypeError

> Value is not the expected type

```js
// console operation
const person = void 0
person.name
```

3. ReferenceError

> Reference to an undeclared variable

```js
// console operation
nodefined
```

4. RangeError

> When a value is not in its allowed range or set

```js
(function fn ( ) { fn() })()
```

### network error

1. ResourceError

> Resource loading error

```js
new Image().src = '/remote/image/notdeinfed.png'
```

2. HttpError

> Http request error

```js
// console operation
fetch('/remote/notdefined', {})
```



## Error capture method

### try/catch

> Can catch regular runtime errors, but cann't capture syntax errors and asynchronous errors

```js
// General runtime errors, which can be captured ✅
try {
  console.log(notdefined);
} catch(e) {
  console.log('captured Error：', e);
}

// Syntax error, cannot be captured ❌
try {
  const notdefined,
} catch(e) {
  console.log('captured Error：', e);
}

// Asynchronous error, cannot be caught ❌
try {
  setTimeout(() => {
    console.log(notdefined);
  }, 0)
} catch(e) {
  console.log('captured Error：',e);
}
```

### window.onerror

> Pure js error collection, window.oneerror. When an error occurs during JS runtime, window will trigger an error event of the ErrorEvent interface.

```js
/**
* @param {String}  message   [error info]
* @param {String}  source    [error file]
* @param {Number}  lineno    [error line]
* @param {Number}  colno     [error column]
* @param {Object}  error     [error Object]
*/

window.onerror = function(message, source, lineno, colno, error) {
   console.log('captured Error：', {message, source, lineno, colno, error});
}
```

### window.addEventListener

> When a resource (such as a picture or script) fails to load, the element that loads the resource will trigger an error event of the Event interface. These error events will not bubble up to the window, but can be captured. Windows. oneerror cannot monitor capture.

```js
// Images, scripts, and css loading errors can be captured ✅
<script>
  window.addEventListener('error', (error) => {
     console.log('captured Error：', error);
  }, true)
</script>
<img src="https://yun.tuia.cn/image/kkk.png">
<script src="https://yun.tuia.cn/foundnull.js"></script>
<link href="https://yun.tuia.cn/foundnull.css" rel="stylesheet"/>
  
// New Image error, unable to capture ❌
<script>
  window.addEventListener('error', (error) => {
    console.log('captured Error：', error);
  }, true)
</script>
<script>
  new Image().src = 'https://yun.tuia.cn/image/lll.png'
</script>

// Fetch error, unable to catch ❌
<script>
  window.addEventListener('error', (error) => {
    console.log('captured Error：', error);
  }, true)
</script>
<script>
  fetch('https://tuia.cn/test')
</script>
```

### Promise error

1. Common Promise error

```js
// Try/catch cannot handle JSON.parse error because it is in Promise
try {
  new Promise((resolve,reject) => { 
    JSON.parse('')
    resolve();
  })
} catch(err) {
  console.error('in try catch', err)
}

// Need to use the catch method
new Promise((resolve,reject) => { 
  JSON.parse('')
  resolve();
}).catch(err => {
  console.log('in catch fn', err)
})
```

2. async error

> Try/catch cannot catch the error of async package

```js
const getJSON = async () => {
  throw new Error('inner error')
}

// Processing through try/catch
const makeRequest = async () => {
    try {
        // unable capture
        JSON.parse(getJSON());
    } catch (err) {
        console.log('outer', err);
    }
};

try {
    // try/catch unable capture
    makeRequest()
} catch(err) {
    console.error('in try catch', err)
}

try {
    // You need await to capture
    await makeRequest()
} catch(err) {
    console.error('in try catch', err)
}
```

3. import chunk error

> Import actually returns a promise, so use the following two methods to catch errors

```js
// Promise catch method
import(/* webpackChunkName: "incentive" */'./index').then(module => {
    module.default()
}).catch((err) => {
    console.error('in catch fn', err)
})

// await method，try catch
try {
    const module = await import(/* webpackChunkName: "incentive" */'./index');
    module.default()
} catch(err) {
    console.error('in try catch', err)
}
```

The above three types are actually attributed to Promise type errors, which can be captured through **unhandledprojection**

```js
// Global unified processing Promise
window.addEventListener("unhandledrejection", function(e){
  console.log('captured Error：', e);
});
fetch('https://tuia.cn/test')
```

To prevent missing Promise exceptions, unhandledrejection can be used to globally listen for Uncaught Promise Errors.

### Vue error

> Because Vue will capture all Vue single-file components or the code inherited by Vue.extend, the errors in Vue **will not be directly captured by window.oneerror**, but will be thrown to **Vue.config.errorHandler**.

```js
/**
 * Capture Vue errors globally and throw them directly to oneerror for processing
 */
Vue.config.errorHandler = function (err) {
  setTimeout(() => {
    throw err
  })
}
```

### React error

> React declares a component with an error boundary through **componentDidCatch**

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so that the degraded UI can be displayed in the next rendering
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also report the error log to the server
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can customize the degraded UI and render it
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

However, error boundaries will not catch the following errors: 

**<u>React event processing</u>**

**<u>asynchronous code</u>**

<u>**errors thrown by error boundaries themselves.**</u>

### Cross-domain issues

> Generally, if there is an error such as **script error**, it can basically be determined that there is a **cross-domain** problem.

If the current launch page and the cloud JS are in different domain names, if the cloud JS has an error, a script error will appear in window.oneerror. It can be solved by the following two methods.

- The backend is configured with **Access-Control-Allow-Origin**, front-end script and **crossorigin**.

```js
<script src="http://yun.tuia.cn/test.js" crossorigin></script>

const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = 'http://yun.tuia.cn/test.js';
document.body.appendChild(script);
```

- If you cannot modify the request header of the server, you can consider using **try/catch** to bypass and throw the error.

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
    foo(); // Call the foo method defined in testerror.js
  } catch (e) {
    throw e;
  }
  </script>
</body>
</html>
```

If you do not add try catch, console.log will print script error. Add try catch to capture.



## Error Capture Validation

```js
// General runtime errors, which can be captured ✅
window.onerror = function(message, source, lineno, colno, error) {
  console.log('captured Error：',{message, source, lineno, colno, error});
}
console.log(notdefined);

// Syntax error, cannot be captured ❌
window.onerror = function(message, source, lineno, colno, error) {
  console.log('captured Error：',{message, source, lineno, colno, error});
}
const notdefined,
      
// Asynchronous errors can be captured ✅
window.onerror = function(message, source, lineno, colno, error) {
  console.log('captured Error：',{message, source, lineno, colno, error});
}
setTimeout(() => {
  console.log(notdefined);
}, 0)

// Resource error, unable to capture ❌
<script>
  window.onerror = function(message, source, lineno, colno, error) {
  console.log('captured Error：',{message, source, lineno, colno, error});
  return true;
}
</script>
<img src="https://yun.tuia.cn/image/kkk.png">
```

























