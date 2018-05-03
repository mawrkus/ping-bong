# Ping Bong

A simple ping tool that follows HTTP redirections.

## 🏓 Installation

```shell
$ npm install -g ping-bong
```

## 🏓 Usage

## CLI

```shell
$ ping-bong http://www.softonic.com/ie/12345
[
  {
    "method": "head",
    "url": "http://www.softonic.com/ie/12345",
    "to": "https://www.softonic.com/ie/12345",
    "statusCode": 301,
    "statusText": "Moved Permanently",
    "userAgent": "ping-bong/3.0.0"
  },
  {
    "method": "head",
    "url": "https://www.softonic.com/ie/12345",
    "to": "https://pingtool.softonic.com",
    "statusCode": 301,
    "statusText": "Moved Permanently",
    "userAgent": "ping-bong/3.0.0"
  },
  {
    "method": "head",
    "url": "https://pingtool.softonic.com",
    "statusCode": 200,
    "statusText": "OK",
    "userAgent": "ping-bong/3.0.0"
  }
]

```

## API

```javascript
const PingBong = require('ping-bong');

(async () => {
  const pingyBong = new PingBong({
    httpOptions = {
      method: 'get',
      headers: {
        'User-Agent': 'pingee-beengee/42.0',
      },
    },
    includes = {
      'request.method': 'method',
      'request.url': 'url',
      'response.headers.location': 'to',
      'response.status': 'statusCode',
      'response.statusText': 'statusText',
      'request.headers.user-agent': 'userAgent',
    },
  });

  const redirections = await pingyBong.check({ url });

  console.log(JSON.stringify(redirections, null, 2));
})();
```

## 🏓 Demo

Clone the project...

```shell
$ git clone https://github.com/mawrkus/ping-bong.git
$ cd bong
$ npm install
$ npm run demo
```
