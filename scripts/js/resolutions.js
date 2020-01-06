#!/usr/bin/env node

/**
 * This script is a helper for running a buidler based e2e unit test target and is
 * used in combination with the npm virtual publishing script.
 *
 * It discovers the current web3 package version, gets its patch increment
 * (also the value of the virtually published version) and attaches a yarn resolutions field
 * to the target's package.json to coerce any Web3 packages up to the patch when target is
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

const patch = semver.inc(web3Package.version, 'patch');

targetPackage.resolutions = {
  "@nomiclabs/**/web3": `${patch}`,
  "@nomiclabs/**/web3-bzz": `${patch}`,
  "@nomiclabs/**/web3-core-helpers": `${patch}`,
  "@nomiclabs/**/web3-core-method": `${patch}`,
  "@nomiclabs/**/web3-core-promievent": `${patch}`,
  "@nomiclabs/**/web3-core-requestmanager": `${patch}`,
  "@nomiclabs/**/web3-core-subscriptions": `${patch}`,
  "@nomiclabs/**/web3-core": `${patch}`,
  "@nomiclabs/**/web3-eth-abi": `${patch}`,
  "@nomiclabs/**/web3-eth-accounts": `${patch}`,
  "@nomiclabs/**/web3-eth-contract": `${patch}`,
  "@nomiclabs/**/web3-eth-ens": `${patch}`,
  "@nomiclabs/**/web3-eth-iban": `${patch}`,
  "@nomiclabs/**/web3-eth-personal": `${patch}`,
  "@nomiclabs/**/web3-eth": `${patch}`,
  "@nomiclabs/**/web3-net": `${patch}`,
  "@nomiclabs/**/web3-providers-http": `${patch}`,
  "@nomiclabs/**/web3-providers-ipc": `${patch}`,
  "@nomiclabs/**/web3-providers-ws": `${patch}`,
  "@nomiclabs/**/web3-shh": `${patch}`,
  "@nomiclabs/**/web3-utils": `${patch}`
}

console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
console.log(`Yarn will resolve Web3 packages in "${process.argv[2]}"" to...`);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

console.log(JSON.stringify(targetPackage.resolutions, null, ' '));

fs.writeFileSync(targetPackagePath, JSON.stringify(targetPackage, null, '    '));

