# Ping Bong

[![npm](https://img.shields.io/npm/l/ping-bong.svg)](https://www.npmjs.org/package/ping-bong) [![npm](https://img.shields.io/npm/v/ping-bong.svg)](https://www.npmjs.org/package/ping-bong)
![Node version](https://img.shields.io/node/v/ping-bong.svg?style=flat-square)

A simple SEO ping tool that follows HTTP redirections.

## 🏓 Installation

```shell
npm install -g ping-bong
```

Or using it directly with [npx](https://docs.npmjs.com/cli/v7/commands/npx):

```shell
npx ping-bong http://gizmodo.com
```

## 🏓 Usage

## CLI

```shell
npx ping-bong http://gizmodo.com
[
  {
    "method": "head",
    "url": "http://gizmodo.com",
    "to": "https://gizmodo.com/",
    "statusCode": 301,
    "statusText": "Moved Permanently",
    "responseTime": 71,
    "userAgent": "ping-bong/3.0.8"
  },
  {
    "method": "head",
    "url": "https://gizmodo.com/",
    "to": "https://es.gizmodo.com/",
    "statusCode": 302,
    "statusText": "https://es.gizmodo.com/",
    "responseTime": 68,
    "userAgent": "ping-bong/3.0.8"
  },
  {
    "method": "head",
    "url": "https://es.gizmodo.com/",
    "statusCode": 200,
    "statusText": "OK",
    "responseTime": 82,
    "userAgent": "ping-bong/3.0.8"
  }
]
```

## API

```javascript
const PingBong = require('ping-bong');

(async () => {
  const pingyBong = new PingBong({
    httpOptions: {
      method: 'get',
      headers: {
        'User-Agent': 'pingee-beengee/42.0',
      },
      maxRedirects: 10,
    },
    includes: {
      'request.method': 'method',
      'request.url': 'url',
      'response.headers.location': 'to',
      'response.status': 'statusCode',
      'response.statusText': 'statusText',
      'response.responseTime': 'responseTime',
      'request.headers.user-agent': 'userAgent',
    },
  });

  const redirections = await pingyBong.check({
    url: 'http://gizmodo.com',
  });

  console.log(JSON.stringify(redirections, null, 2));
})();
```

## 🏓 Demo

```shell
$ git clone https://github.com/mawrkus/ping-bong.git
$ cd ping-bong
$ npm install
$ npm run demo
```
