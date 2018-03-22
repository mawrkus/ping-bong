#!/usr/bin/env node

const axios = require('axios');
const pingBong = require('..');

const url = process.argv[2];
if (!url) {
  console.error('Please provide a URL!');
  process.exit(1);
}

(async () => {
  try {
    const redirections = await pingBong({ url });
    console.log(JSON.stringify({ url, redirections }, null, 2));
  } catch(error) {
    console.log(error);
  }
})();
