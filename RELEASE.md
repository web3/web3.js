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

### Manual Steps For Alpha Release

1. `git checkout 4.x`: Verify you are on the `4.x` base branch
2. `git checkout -b release/bumped-version`: Create and checkout a branch with the `bumped-version` e.g. `git checkout -b release/4.0.0-alpha.0`
    - `bumped-version` of release branch should be of main web3 package.
3. `yarn`: Verify all dependencies have been installed
4. Bump packages version numbers using `lerna version --no-push --no-private --no-git-tag-version`
    - It will prompt for new version , modify package metadata and run life cycle scripts (in our case `version`), for bootstrapping lerna will use underlying yarn.
    - ( For first 4.x alpha version bump with lerna is not required as all versions in 4.x branch are already bumped, so invoke following scripts manually:
      `yarn run build`)
5. Commit the version bump changes and builds in release branch created in step 2
6. `git tag release/bumped-version`: Tag the commit with bumped version, e.g. `4.0.0-alpha.0`
7. `git push origin release/bumped-version`: Push release branch to `origin`
8. `git push origin --tags`: Push release tag created in `Step 8` to `origin`
9. Create a draft release on Github similar to [this](https://github.com/ChainSafe/web3.js/releases/tag/web3-providers-base%401.0.0-alpha.1)
    - When creating the release, select the tag created in `step 8` (`release/bumped-version`)
    - Release title should also be `version-number`
    - Check `This is a pre-release`
    - In the release description, copy all entries in `CHANGELOG.md` for the version being released
10. Click `Save draft`
11. Open pull request to merge branch created in `Step 2` (`release/bumped-version`) into `4.x`
12. Wait for all tests to pass in github CI/CD actions
13. When sufficient approvals have been met, merge the pull request
14. Publish documentation changes
15. Publish draft release created in `Step 9`
16. Run `npx lerna publish from-package --ignore-scripts --dist-tag alpha` in the root directory to publish packages to NPM
    - lerna will not invoke life cycle scripts before publishing and this will publish all packages to NPM public registry
