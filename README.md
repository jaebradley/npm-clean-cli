[![Build Status](https://travis-ci.org/jaebradley/npm-clean-cli.svg?branch=master)](https://travis-ci.org/jaebradley/npm-clean-cli)
[![codecov](https://codecov.io/gh/jaebradley/npm-clean-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/jaebradley/npm-clean-cli)
[![npm](https://img.shields.io/npm/v/npm-clean-cli.svg)](https://github.com/jaebradley/npm-clean-cli)
[![npm](https://img.shields.io/npm/dt/npm-clean-cli.svg)](https://github.com/jaebradley/npm-clean-cli)

# npm-clean-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/jaebradley/npm-clean-cli.svg)](https://greenkeeper.io/)

## Introduction
There are times when you're working in an `npm` project and you'd like to start "fresh", from a dependency point of view i.e.<sup>1</sup>

* Blow away your `node_modules` directory
* [Clean your `npm` cache](https://docs.npmjs.com/cli/cache) 
  * Even if 
  > it should never be necessary to clear the cache for any reason other than reclaiming disk space
* And reinstall your `npm` dependencies

## Installation
```bash
npm install npm-clean-cli -g
```

## Usage

* Go to a directory that you'd like to "clean"
* Execute `npmclean`
  * Your directory must have a `package.json` file or else the additional commands won't run
  * If you do have a `package.json` file, the output should look something like
  ![alt-text](https://i.imgur.com/FbkcuGo.png)

## Footnotes
<sup>1</sup>
And yeah, I know that doing something like
```bash
rm -rf node_modules; npm clean cache --force; npm install
```
is not that verbose, and even if it is, you could assign it to a bash alias. But hey, I guess I like to overengineer things.
