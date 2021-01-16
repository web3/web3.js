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
* [`web3-cli block [PROVIDER]`](#web3-cli-block-provider)
* [`web3-cli help [COMMAND]`](#web3-cli-help-command)
* [`web3-cli validatorInfo [FILE]`](#web3-cli-validatorinfo-file)

## `web3-cli block [PROVIDER]`

describe the command here

```
USAGE
  $ web3-cli block [PROVIDER]

ARGUMENTS
  PROVIDER  HTTP endpoint for Ethereum node

OPTIONS
  -b, --blockId=blockId  (required) Block identifier
  -c, --chain=chain      [default: 1] Version of Ethereum chain e.g. ETH1 is default while ETH2 = 2
  -h, --help             show CLI help
```

_See code: [src/commands/block.ts](https://github.com/ChainSafe/web3-cli/blob/v0.0.0/src/commands/block.ts)_

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

## `web3-cli validatorInfo [FILE]`

describe the command here

```
USAGE
  $ web3-cli validatorInfo [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/validatorInfo.ts](https://github.com/ChainSafe/web3-cli/blob/v0.0.0/src/commands/validatorInfo.ts)_
<!-- commandsstop -->
