import * as fs from 'fs';

const versionFile = JSON.parse(
  fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'),
);

export const {
  version: appVersion,
  name: appName,
  description: appDescription,
  author: appAuthor,
} = versionFile;
