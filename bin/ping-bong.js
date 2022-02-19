#!/usr/bin/env node

/* eslint-disable no-console */

const PingBong = require('..');

const [, , url, method = 'head'] = process.argv;

if (!url) {
  console.error('Please provide a URL!');
  process.exit(1);
}

(async () => {
  try {
    const pingyBong = new PingBong({ httpOptions: { method } });
    const redirections = await pingyBong.check({ url });
    console.log(JSON.stringify(redirections, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
