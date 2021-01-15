web3-cli
========

A CLI that interacts with various Web3.js packages

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/web3-cli.svg)](https://npmjs.org/package/web3-cli)
[![Codecov](https://codecov.io/gh/ChainSafe/web3-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/ChainSafe/web3-cli)
[![Downloads/week](https://img.shields.io/npm/dw/web3-cli.svg)](https://npmjs.org/package/web3-cli)
[![License](https://img.shields.io/npm/l/web3-cli.svg)](https://github.com/ChainSafe/web3-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g web3-cli
$ web3-cli COMMAND
running command...
$ web3-cli (-v|--version|version)
web3-cli/0.0.0 linux-x64 node-v15.5.1
$ web3-cli --help [COMMAND]
USAGE
  $ web3-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`web3-cli hello [FILE]`](#web3-cli-hello-file)
* [`web3-cli help [COMMAND]`](#web3-cli-help-command)
* [`web3-cli validator [FILE]`](#web3-cli-validator-file)

## `web3-cli hello [FILE]`

describe the command here

```
USAGE
  $ web3-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ web3-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/ChainSafe/web3-cli/blob/v0.0.0/src/commands/hello.ts)_

## `web3-cli help [COMMAND]`

display help for web3-cli

```
USAGE
  $ web3-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `web3-cli validator [FILE]`

describe the command here

```
USAGE
  $ web3-cli validator [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/validator.ts](https://github.com/ChainSafe/web3-cli/blob/v0.0.0/src/commands/validator.ts)_
<!-- commandsstop -->
