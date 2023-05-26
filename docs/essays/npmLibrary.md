# frequently-used npm library

Note: It is not necessary to use these libraries. The functions or styles that can be implemented should be implemented by yourself

## eslint【code format】

**install**

> npm install eslint --save-dev
> ./node_modules/.bin/eslint --init

![image.png](https://cdn.nlark.com/yuque/0/2022/png/26897102/1655357812300-de50fd52-0466-4604-8b36-20f57b1bcb81.png)

然后会生成一个 .eslintrc.js 文件，可以在里面配置eslint配置

## file-saver 【for save file】

**install**

> npm install file-saver --save

**use**

```js
import { saveAs } from 'file-saver'
// 保存文本
const blob = new Blob(['Hello, world!'])
saveAs(blob, 'hello world.txt')
// 保存图片
saveAs('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png')
// 保存文件
const blob = new Blob([fileStream]) // fileStream 是文件流，一般从后台获取
saveAs(blob, fileName) // fileName 保存文件的名称，需要带后缀
```

**encapsulation**

```js
import axios from 'axios'
import { saveAs } from 'file-saver'

/**
 * @params {string} localFileName 本地文件名称
 * @params {string} saveFileName 下载的文件名称
 * @retuen {promise}
 */
export const downloadLocalFile = (localFileName, saveFileName) => {
  return new Promise((resolve, reject) => {
    // 本地文件夹路径+本地文件名称(若资源在服务器，且是具体的路径，
    // 这里可改成该资源路径，此时encapsulation的方法需要微调，入参的localFileName改成资源路径resource)
    axios({
      url: `/file/${localFileName}`,	
      method: 'get',					
      responseType: 'blob',			//	arraybuffer	也可
    }).then(res => {
      const blob = new Blob([res.data])
      if (navigator.msSaveBlob) {			// 兼容IE
        navigator.msSaveBlob(blob, saveFileName)
      } else {
        const url = window.URL.createObjectURL(blob)
        saveAs(url, saveFileName)
      }
      resolve()
    }).catch(err => {
      // 这里可以统一处理错误，比如"未找到相关文件"，"下载失败"等
      if (err.message === 'Request failed with status code 404') {
        // 提示or弹框：未找到相关文件
      } else {
        // 提示or弹框：下载失败
      }
      reject(err)
    })
  })
}

// use（注意文件格式的后缀名）
downloadLocalFile('excelFile.xlsx', 'newExcelFile.xlsx').then(res => {
  // 下载成功后的操作
  console.log('下载成功！')
})
```

```js
import axios from 'axios'
import { saveAs } from 'file-saver'
/**
 * @params {stream} fileStream 服务器返回的文件流
 * @params {string} saveFileName 下载的文件名称
 * @retuen {promise}
 */
export const downloadFile = (fileStream, saveFileName) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([fileStream])
    if (navigator.msSaveBlob) {			// 兼容IE
      navigator.msSaveBlob(blob, saveFileName)
    } else {
      const url = window.URL.createObjectURL(blob)
      saveAs(url, saveFileName)
    }
    resolve()
  }) 
}

// use（注意文件格式的后缀名）
const fileStream = async xxApi()  // 获取文件流
downloadFile(fileStream, 'file.pdf').then(res => {
  // 下载成功后的操作
  console.log('下载成功！')
})
```

## uuid【Generate unique serial number of data】

> [https://www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid)

**install**

> npm install uuid

**use**

commonJS引入

> import { v4 as uuidv4 } from 'uuid';
>
> uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

ES6引入

> const { v4: uuidv4 } = require('uuid');
>
> uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

## animate.css【animate effect】

> [https://animate.style](https://animate.style)

**install**

> npm install animate.css --save

**在main.js中引入**

> import animate from 'animate.css'
>
> Vue.use(animate)

**use**

在对应的html标签添加类名即可

```html
<h1 class="animate__animated animate__bounce">An animated element</h1>
```

## moment.js【time processing】

> [http://momentjs.cn/](http://momentjs.cn/)

**install**

> npm install moment --save

**use**

> import moment from 'moment'
>
> moment().format('MMMM Do YYYY, h:mm:ss a'); // 六月 18日 2022, 2:56:15 下午

## vue-horizontal【responsive scrolling plug-in】

> [https://www.npmjs.com/package/vue-horizontal](https://www.npmjs.com/package/vue-horizontal)

**install**

> npm i vue-horizontal

**use**

```vue
<template>
  <vue-horizontal responsive>
    <section v-for="item in items" :key="item.title">
      <h3>{{ item.title }}</h3>
      <p>{{ item.content }}</p>
    </section>
  </vue-horizontal>
</template>

<script>
import VueHorizontal from "vue-horizontal";

export default {
  components: {VueHorizontal},
  data() {
    return {
      // E.g: creates 20 array items...
      items: [...Array(20).keys()].map((i) => {
        return {title: `Item ${i}`, content: `🚀 Content ${i}`};
      }),
    }
  }
}
</script>

<style scoped>
section {
  padding: 16px 24px;
  background: #f5f5f5;
}
</style>
```

## normalize.css【style initialization】

> [https://www.npmjs.com/package/normalize.css](https://www.npmjs.com/package/normalize.css)

**install**

> npm install normalize.css -S

**use**

```js
import 'normalize.css/normalize.css'
```

## vue-pdf【pdf preview】

> [https://www.npmjs.com/package/vue-pdf](https://www.npmjs.com/package/vue-pdf)

**install**

> npm install vue-pdf

**use**

```vue
<template>
  <div class="pdf-wrap">
    <div class="control">
      <el-button size="medium" @click="changePdfPage('up')">上一页</el-button>
      <div class="all-m-l-10 all-m-r-10">{{ currentPage }}/{{ pageCount }}</div>
      <el-button size="medium" @click="changePdfPage('down')">下一页</el-button>
    </div>
    <pdf
      :src="src"
      :page="currentPage"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
      @loaded="loadPdfHandler"
      @error="loadError"
    />
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'PdfWrap',
  components: {
    pdf
  },
  props: {
    src: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      currentPage: 1,
      pageCount: 0
    }
  },
  created() {
    this.$emit('updata:src', pdf.createLoadingTask(this.src), { withCredentials: false })
  },
  methods: {
    // 改变PDF页码,type传过来区分上一页下一页的值,up上一页,down下一页
    changePdfPage(type) {
      if (type === 'up' && this.currentPage > 1) {
        this.currentPage--
      }
      if (type === 'down' && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    // pdf加载时，先加载第一页
    loadPdfHandler(e) {
      this.currentPage = 1
    },
    // 加载失败
    loadError() {
      this.$message.error('加载pdf失败！')
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-wrap {
  .control {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
```

## vue-cal【vue calendar】

> [https://www.npmjs.com/package/vue-cal](https://www.npmjs.com/package/vue-cal)

**install**

> npm i vue-cal@legacy

**use**

> [https://antoniandre.github.io/vue-cal](https://antoniandre.github.io/vue-cal)

```vue
<vue-cal :time="false" small active-view="year" locale="zh-cn" />

import 'vue-cal/dist/i18n/zh-cn.js'. 
```

## pinyin-pro【chinese character to pinyin】

> [https://www.npmjs.com/package/pinyin-pro](https://www.npmjs.com/package/pinyin-pro)

**install**

> npm install pinyin-pro -D

**use**

```js
import { pinyin } from 'pinyin-pro';

// 获取带音调拼音
pinyin('汉语拼音'); // 'hàn yǔ pīn yīn'
// 获取不带声调的拼音
pinyin('汉语拼音', { toneType: 'none' }); // 'han yu pin yin'
// 获取声调转换为数字后缀的拼音
pinyin('汉语拼音', { toneType: 'num' }); // 'han4 yu3 pin1 yin1'
// 获取数组形式带音调拼音
pinyin('汉语拼音', { type: 'array' }); // ["hàn", "yǔ", "pīn", "yīn"]
// 获取数组形式不带声调的拼音
pinyin('汉语拼音', { toneType: 'none', type: 'array' }); // ["han", "yu", "pin", "yin"]
// 获取数组形式声调转换为数字后缀的拼音
pinyin('汉语拼音', { toneType: 'num', type: 'array' }); // ["han4", "yu3", "pin1", "yin1"]
```

## mathjs【calculate decimals】

> [https://www.npmjs.com/package/mathjs](https://www.npmjs.com/package/mathjs)

**install**

> npm install mathjs

**use**

```js
import {
  atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt
} from 'mathjs'

// functions and constants
round(e, 3)                    // 2.718
atan2(3, -3) / pi              // 0.75
log(10000, 10)                 // 4
sqrt(-4)                       // 2i
pow([[-1, 2], [3, 1]], 2)      // [[7, 0], [0, 7]]
derivative('x^2 + x', 'x')     // 2 * x + 1

// expressions
evaluate('12 / (2.3 + 0.7)')   // 4
evaluate('12.7 cm to inch')    // 5 inch
evaluate('sin(45 deg) ^ 2')    // 0.5
evaluate('9 / 3 + 2i')         // 3 + 2i
evaluate('det([-1, 2; 3, 1])') // -7

// 链式调用
chain(3).add(4).multiply(2).done()  // 14
```

## superagent【lightweight ajax API】

> [https://www.npmjs.com/package/superagent](https://www.npmjs.com/package/superagent)

**document**

> [https://ladjs.github.io/superagent/docs/zh_CN/index.html](https://ladjs.github.io/superagent/docs/zh_CN/index.html)

**install**

> npm install superagent --save

**use**

```js
const superagent = require('superagent');

superagent
  .post('/api')
  .send({
    'key': 'value'
  })
  .set('header_key', 'header_value')
  .end(function(err, res) {
    if (err) {
      // do something
    } else {
      // do something
    }
  })
```

## chalk【commend line beautification tool】

> [https://www.npmjs.com/package/chalk](https://www.npmjs.com/package/chalk)

**install**

> npm install chalk

**use**

```javascript
import chalk from 'chalk';
const log = console.log;

log(chalk.blue('Hello') + ' World' + chalk.red('!'));
```

## Next....





















