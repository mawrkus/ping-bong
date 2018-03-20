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
{
  "url": "http://www.softonic.com/ie/12345",
  "redirections": [
    {
      "statusCode": 301,
      "to": "https://www.softonic.com/ie/12345"
    },
    {
      "statusCode": 301,
      "to": "https://pingtool.softonic.com"
    },
    {
      "statusCode": 200,
      "url": "https://pingtool.softonic.com"
    }
  ]
}
```

```shell
$ ping-bong http://www.softonic.com/ie/12345/xxx                       
{
  "url": "http://www.softonic.com/ie/12345/xxx",
  "redirections": [
    {
      "statusCode": 301,
      "to": "https://www.softonic.com/ie/12345/xxx"
    },
    {
      "error": {
        "statusCode": 404,
        "statusText": "Not Found"
      },
      "url": "https://www.softonic.com/ie/12345/xxx"
    }
  ]
}
```

## API

```javascript
const pingBong = require('ping-bong');

(async () => {
  const redirections = await pingBong({ url });
  console.log(JSON.stringify({ url, redirections }, null, 2));
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
