# web3.js Release Guidelines

## Version Number Definition

The web3.js project follows the [semver 2.0.0 specification](https://semver.org/).

### Major

The `major` version has to be increased as soon as a breaking change is introduced. The definition of a breaking change is anything that requires a depending project to update their code base, build pipeline or tests.

### Minor

The `minor` is increased as soon as new smaller features do get introduced. A `minor` release will not affect any depending project. Such a release only introduces smaller enhancements and features a project could use.

### Patch

A patch release only contains required bug fixes with a low risk to impact depending project.

Further details about versioning can be found in the [semver 2.0.0 specification](https://semver.org/) we follow.

## Release Process

### Manual Steps (needs to be done per package)

1. `git checkout 4.x`: Verify you are on the `4.x` base branch
2. `git checkout -b release/package-name/bumped-version`: Checkout a branch with the `package-name` and `bumped-version` e.g. `git checkout -b release/web3-packagetemplate/1.0.1`
3. `yarn`: Verify all dependencies have been installed
4. `cd packages/package-name`: `cd` into the package to be released
5. Update the version number in the `package.json`
6. Run `yarn lint` from project root: `yarn --cwd ../../ lint`
7. `git add package.json && git commit -m 'Release package-name@version-number'`: Commit the version bump, commit message should be `'Release package-name@version-number'` e.g. `Release web3-packagetemplate@1.0.0`
8. `git tag package-name@version-number`: Tag the commit with package name and bumped version, e.g. `web3-packagetemplate@1.0.1`
9. `git push origin release/package-name/bumped-version`: Push release branch to `origin`
10. `git push --tags`: Push release tag created in `Step 8` to `origin`
11. Create a draft release on Github similar to [this](https://github.com/ChainSafe/web3.js/releases/tag/web3-providers-base%401.0.0-alpha.1)
    - When creating the release, select the tag created in `step 8` (`packagename@version-number`)
    - Release title should also be `packagename@version-number`
    - In the release description, copy all entries in `CHANGELOG.md` for the version being released
12. Click `Save draft`
13. Open pull request to merge branch created in `Step 2` (`release/package-name/bumped-version`) into `4.x`
14. When sufficient approvals have been met, merge the pull request
15. Publish draft release created in `Step 11`
16. Run `npm publish` in the package directory to publish to NPM
    - If a tag is needed, such as `alpha`, use `npm publish --tag alpha`
