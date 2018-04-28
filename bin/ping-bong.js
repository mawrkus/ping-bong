#!/usr/bin/env node

/* eslint-disable no-console */

const pingBong = require('..');

const url = process.argv[2];
if (!url) {
  console.error('Please provide a URL!');
  process.exit(1);
}

const method = process.argv[3];

(async () => {
  try {
    const redirections = await pingBong({ method, url });
    console.log(JSON.stringify({ url, redirections }, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
