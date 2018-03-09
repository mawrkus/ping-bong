# Bong

A simple ping tool that follows HTTP redirections.

## 🎯 Installation

```shell
$ npm install -g bong
```

## 🎯 Usage

```shell
$ bong http://www.softonic.com/ie/12345
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
$ node index.js http://www.softonic.com/ie/12345/xxx                       
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

## 🎯 Demo

Clone the project...

```shell
$ git clone https://github.com/mawrkus/bong.git
$ cd bong
$ npm install
$ npm run demo
```
