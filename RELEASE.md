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

## Release Process Rules

### Major

1.  The release should get released as an `legacy-dev` version on the specified track below.
2.  The major `legacy-dev` version stays released for a `month` for testing purposes.
3.  During release review, the code is frozen unless new changes are proposed, approved and merged.
    i.  Changes should trigger a new `legacy-dev` release and set the release clock back a `week` so reviewers have the time they need to test new changes.

### Minor

The `minor` release inherits the rules from the `major` release but has a smaller testing phase of 3 days and the release clock will be set back `2 days` on a change of the published code.

### Patch

Since November 2019, Web3 has been following the `minor` rules for `patch` as well, to help establish a series of non-breaking releases.

## Prereleases

### Legacy-dev Release ( Release Candidate )

A Legacy-dev release gets published on the `legacy-dev` track and is no longer under active development. A release candidate gets/Legacy-dev released with the version number defined in the [semver 2.0.0 specification](https://semver.org/) specification.

## Deprecation Rules

Because breaking changes are always happening during the development of a project it is required to define rules on how we inform depending projects about coming changes with enough time to react. This doesn't mean that we plan to introduce breaking changes but sometimes they are required.

1.  Deprecations will be announced in our `CHANGELOG` and in the description of a release.
2.  Deprecated functionalities should be marked in the developer documentation, function documentation, and the related types as deprecated.
3.  A deprecated functionality stays deprecated for the next `X (TBD)` increases of the minor version.

# web3.js Release Process

The following describes the steps required to release a new version of `web3.js`. It is followed to adhere to community standards and expectations.

# 1.x Future releases
As web3.js v4 published so everyone is requested to migrate to web3.js v4. Web3.js v1 will only get critical security updates and will follow tags:
    - `legacy` : for v1 main releases 
    - `legacy-dev` : for v1 test/RC releases, this is replacement of `rc` tag

## Legacy Dev (Release Candidate) Release Procedure

1.  `git checkout 1.x` and `git pull`: Verify you are on the `1.x` base branch.
2.  `git checkout -b release/bumped-version`: Create release branch (e.g. `release/1.10.4`).
3.  In the project root, run `npm i` and commit changes using a commit message like: `npm i for 1.10.4-dev.0`
4.  Update and commit changes of `CHANGELOG.md` using a commit message like: `changelog update for 1.10.4-dev.0`.
    4.A. Add next anticipated release version in place of `[Unreleased]`
    4.B. Move section header `[Unreleased]` to bottom of file. 
5.  Bump package version and build lib using learna `lerna version 1.10.4-dev.0 --no-push --no-private --no-git-tag-version`
    - This will bump package version numbers, builds lib and minified file by invoking lifecycle scripts. 
6.  Commit the version bump changes and builds in release branch created in `step 2`.
7.  `git tag bumped-version`: Tag the commit with bumped version having prefix `v` , e.g. `git tag v1.0.1-dev.0`
6.  Push release branch on github `git push origin release/1.2.7`.
8.  Push release tag created in Step 7 to github `git push origin --tags`
9.  Create a draft release on Github similar to [this](https://github.com/web3/web3.js/releases/tag/v1.10.3-dev.0)
    - Select recently pushed tag in `choose a tag` drop down
    - Check `This is a pre-release`
    - Check `Create a discussion for this release`
    - In the release description, copy all entries in `CHANGELOG.md` for the version being released
    - Click `Save draft`
10.  Create release PR ([example](https://github.com/web3/web3.js/pull/6510)).
11.  Ensure CI is green / passing.
    - Spend time here inspecting the CI logs to ensure everything looks valid and results were reported correctly.
12. When sufficient approvals are given, publish draft release created in `Step 9`
13. Publish release on npm using `npm run publish from-package -- --dist-tag legacy-dev`.
    1. Lerna can sometimes have difficulty with the number of packages we have. If the above command is unsuccessful, for every unpublished package run: `lerna publish --scope="package-name"` `npm dist-tag add <package-name>@<version> legacy-dev`
14. Keep same PR open for formal release after few days based on rules defined in this document. 


## Formal Release Procedure for legacy v1 release

1.  Checkout release branch (e.g. `release/1.10.4`) created during legacy-dev release `step 2`.
2.  Verify all dependencies have been installed using `npm i` and commit changes.
    - If you are already in release branch dir, created for `legacy-dev` and no changes are made after it, you can skip step 1 and step 2
3.  Build library and bump versions using: `lerna version 1.10.4 --force-publish --no-push --no-private --no-git-tag-version`
4.  Commit all changes into release branch with commit message like `build for release 1.10.4`
5.  `git tag bumped-version`: Tag the commit with bumped version having prefix `v` , e.g. `git tag v1.10.4`
6.  Push release branch to origin `git push origin release/1.10.4`.
7.  Push release tag created in `Step 5` to `origin` using `git push origin --tags`
8.  Publish the GitHub release.
9.  A GitHub Webhook should trigger the ReadTheDocs build after the release is published.
    -   (The build may sometimes need to be manually triggered in ReadTheDocs admin panel. If the version does not appear, create a build of a previous version to refresh the list.)
    -   Activate the new version.
    -   Set the version to default.
10.  Run `npm run publish from-package -- --dist-tag legacy`, it should be `legacy` tag.
11.  Merge release PR in `1.x` .