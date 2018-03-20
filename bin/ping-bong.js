#!/usr/bin/env node

const axios = require('axios');
const pingBong = require('..');

const url = process.argv[2];
if (!url) {
  throw new Error('Please provide a URL, thanks!');
}

(async () => {
  const redirections = await pingBong({ url });
  console.log(JSON.stringify({ url, redirections }, null, 2));
})();
