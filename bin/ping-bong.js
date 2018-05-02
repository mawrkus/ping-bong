#!/usr/bin/env node

/* eslint-disable no-console */

const PingBong = require('..');

const url = process.argv[2];
if (!url) {
  console.error('Please provide a URL!');
  process.exit(1);
}

(async () => {
  try {
    const pingyBong = new PingBong();
    const redirections = await pingyBong.check({ url });
    console.log(JSON.stringify(redirections, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
