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
    "url": "http://www.softonic.com/ie/12345",
    "method": "head",
    "status": 301,
    "statusText": "Moved Permanently",
    "to": "https://www.softonic.com/ie/12345"
  },
  {
    "url": "https://www.softonic.com/ie/12345",
    "method": "head",
    "status": 301,
    "statusText": "Moved Permanently",
    "to": "https://pingtool.softonic.com"
  },
  {
    "method": "head",
    "url": "https://pingtool.softonic.com",
    "status": 200,
    "statusText": "OK"
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
      request: {
        method: false,
        url: true,
        headers: false,
      },
      response: {
        status: true,
        statusText: false,
        headers: true,
        data: true,
      },
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
