#!/usr/bin/env node

const axios = require('axios');
const bong = require('..');

const url = process.argv[2];
if (!url) {
  throw new Error('Please provide a URL!');
}

(async () => {
  const redirections = await bong({ url });
  console.log(JSON.stringify({ url, redirections }, null, 2));
})();
