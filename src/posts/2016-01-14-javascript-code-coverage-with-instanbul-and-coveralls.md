---
title: "JavaScript Code Coverage With Instanbul and Coveralls"
date: 2016-01-14T21:50:18-02:00
keywords: test, coverage, javascript, npm
author: rafaeleyng
excerpt: >
  A fast lane to set up code coverage in your project
---

## Code coverage

If you want to set up code coverage measurements in a project, there are usually 4 things that you'll need:

- a **test runner** (like [Mocha](https://github.com/mochajs/mocha), [AVA](https://github.com/sindresorhus/ava)), to run your tests
- a **code coverage** tool (like [Istanbul](https://github.com/gotwarlost/istanbul), [nyc](https://github.com/bcoe/nyc)), to generate code coverage reports
- a **code coverage insight** service (like [Coveralls](https://coveralls.io/), [Codecov](https://codecov.io/)), to provide you a nice visualization of your code coverage data
- a **reporting** tool (like [node-coveralls](https://github.com/nickmerwin/node-coveralls), [codecov.io](https://github.com/cainus/codecov.io/)), to send your reports to some service

## Assumptions

I'll assume you already have Mocha locally installed (`npm i -D mocha`) as your test runner, and show you how to do the rest.

I'll also assume that you have TravisCI server configured for your project.

### npm scripts

npm scripts are scripts you add inside package.json. You can add arbitrary shell script commands there, like: `"scripts": { "print-something": "echo 'something'" }`. You can run this script by invoking it by its name: `npm run print-something`.

I try to use npm scripts as much as possible, to avoid global dependencies and to avoid the clutter to manually invoke local dependencies. So all examples here will use this approach.


## Code coverage tool

The principle is: instead of directly running your tests, you set up a middle man to do this and generate the coverage reports. Enter Istanbul.

```sh
npm i -D istanbul
```

In npm scripts:

```json
"coverage": "./node_modules/istanbul/lib/cli cover _mocha test/index.js"
```

or, if you are using ES6 in your tests, do `npm i -D babel-cli` and run it using babel-node:

```json
"coverage": "babel-node ./node_modules/istanbul/lib/cli cover _mocha test/index.js"
```

Note that `_mocha`, with underscore, is the actual runner. `mocha` seems to be just a wrapper around it.

Run this script with `npm run coverage` and it will generate a `coverage` folder with illegible coverage data, and print some results to the console. You should put this folder in .gitignore, with `echo coverage >> .gitignore`.


## Code coverage insight service

Just sign up to [Coveralls](https://coveralls.io/) and add the Github repo you want to watch.


## Coverage reporting tool

Install node-coveralls with:

```sh
npm i -D node-coveralls
```

This will install a tool that knows how to get you `coverage` folder and report it to the Coveralls service.

But you are not going to make those reports manually. Instead, your CI server will do this. Since I'm assuming you are using TravisCI, you should already have a `.travis.yml` file. Add:

```yml
after_success:
  - npm run coverage
  - npm run report-coverage
```

`coverage` is the script that creates the coverage report. `report-coverage` is the script that takes that data and reports it to the service. Since this is running in your CI server, set it up to run for every pull request/push.

The script for `npm run report-coverage` is:

```json
"report-coverage": "cat ./coverage/lcov.info | coveralls"
```

The combination of Coveralls + TravisCI makes that you don't have to provide any kind of token for the two services communicate. If you choose different services, you might need an extra step of configuring some access token.

Extra: if you choose to use Codecov, you should use instead:

```sh
npm i -D codecov.io
```

and

```json
"report-coverage": "cat ./coverage/lcov.info | codecov"
```

## Extra: checking coverage as part of your CI

Want to make your build fail if your coverage falls bellow some threshold? Add an extra script to your `.travis.yml` to be run in your CI build:

```yml
script:
  # ...
  - npm run check-coverage
```

and define that script in `package.json`:

```json
"check-coverage": "istanbul check-coverage --statements 70 --branches 70 --functions 70 --lines 70",
```

Those `70`s are the percentage of coverage that you want as a threshold. Your build will fail if those thresholds are not met.
