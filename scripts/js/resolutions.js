#!/usr/bin/env node

/**
 * This script is a helper for running a buidler based e2e unit test target and is
 * used in combination with the npm virtual publishing script.
 *
 * It discovers the current web3 package version, gets its minor increment
 * (also the value of the virtually published version) and attaches a yarn resolutions field
 * to the target's package.json to coerce any Web3 packages up when target is
 * installed.
 *
 * USAGE:    resolutions.js <target-folder-name>
 * EXAMPLE:  node scripts/js/resolutions.js mosaic-1
 *
 */
const fs = require('fs');
const path = require('path');

const semver = require('semver');
const web3PackagePath = path.join(process.cwd(), 'original.package.json');
const targetPackagePath = path.join(process.cwd(), process.argv[2], 'package.json');

const web3Package = require(web3PackagePath);
const targetPackage = require(targetPackagePath);

// Use pre-release version which isn't ever really
// published to npm. (Maps to `lerna version` command
// in e2e.npm.publish.sh)
const version = semver.inc(web3Package.version, 'minor');

targetPackage.resolutions = {
  "@nomiclabs/**/web3": `${version}`,
  "@nomiclabs/**/web3-bzz": `${version}`,
  "@nomiclabs/**/web3-core-helpers": `${version}`,
  "@nomiclabs/**/web3-core-method": `${version}`,
  "@nomiclabs/**/web3-core-promievent": `${version}`,
  "@nomiclabs/**/web3-core-requestmanager": `${version}`,
  "@nomiclabs/**/web3-core-subscriptions": `${version}`,
  "@nomiclabs/**/web3-core": `${version}`,
  "@nomiclabs/**/web3-eth-abi": `${version}`,
  "@nomiclabs/**/web3-eth-accounts": `${version}`,
  "@nomiclabs/**/web3-eth-contract": `${version}`,
  "@nomiclabs/**/web3-eth-ens": `${version}`,
  "@nomiclabs/**/web3-eth-iban": `${version}`,
  "@nomiclabs/**/web3-eth-personal": `${version}`,
  "@nomiclabs/**/web3-eth": `${version}`,
  "@nomiclabs/**/web3-net": `${version}`,
  "@nomiclabs/**/web3-providers-http": `${version}`,
  "@nomiclabs/**/web3-providers-ipc": `${version}`,
  "@nomiclabs/**/web3-providers-ws": `${version}`,
  "@nomiclabs/**/web3-shh": `${version}`,
  "@nomiclabs/**/web3-utils": `${version}`
}

console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
console.log(`Yarn will resolve Web3 packages in "${process.argv[2]}"" to...`);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

console.log(JSON.stringify(targetPackage.resolutions, null, ' '));

fs.writeFileSync(targetPackagePath, JSON.stringify(targetPackage, null, '    '));

