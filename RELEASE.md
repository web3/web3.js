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

1.  The release should get released as an `RC` version on the specified track below.
1.  The minor `RC` version stays released for a `month` for testing purposes.
1.  During release review, the code is frozen unless new changes are proposed, approved and merged.
    1.  Changes should trigger a new `RC` release and set the release clock back a `week` so reviewers have the time they need to test new changes.
1.  The project lead should manually test the `RC` against a Node project and the published
    minified bundle in a browser context. An external reviewer should verify they have done the same.

### Minor

The `minor` release inherits the rules from the `major` release but has a smaller testing phase of one `week` and the release clock will be set back `2 days` on a change of the published code.

### Patch

Since November 2019, Web3 has been following the `minor` rules for `patch` as well, to help establish a series of non-breaking releases.

## Prereleases

### Release Candidate

A release candidate gets published on the `rc` track and is no longer under active development. A release candidate gets released with the version number defined in the [semver 2.0.0 specification](https://semver.org/) specification.

### Beta Release

A `beta` release gets published on the `beta` track and is under active developemnt. The version number of the `beta` release gets defined as specified in the [semver 2.0.0](https://semver.org/) document.

## Long Term Support (LTS)

> Note: This section has not yet been decided and so for now is purely informative.

To provide safety over longer periods, it is important to have versions tagged as `LTS`.

| Release |    Status     | Initial Release |   LTS Start   | End-of-Life |
| :-----: | :-----------: | :-------------: | :-----------: | :---------: |
|   1.x   |      LTS      |  24. Jul. 2017  | 23. Jul. 2019 |     TBD     |
|   2.x   |   Deprecated  |  13. Jul. 2019  | 13. Jul. 2019 | 13. Jul. 2020 |
|   3.x   |   Deprecated  |   9. Apr. 2021  |  9. Apr. 2021 | 26. Jan. 2022 |
|   4.x   |  Development  |    Apr. 2022    |      TBD.     |     TBD.    |

## Deprecation Rules

Because breaking changes are always happening during the development of a project it is required to define rules on how we inform depending projects about coming changes with enough time to react. This doesn't mean that we plan to introduce breaking changes but sometimes they are required.

1.  Deprecations will be announced in our `CHANGELOG` and in the description of a release.
2.  Deprecated functionalities should be marked in the developer documentation, function documentation, and the related types as deprecated.
3.  A deprecated functionality stays deprecated for the next `X (TBD)` increases of the minor version.

# web3.js Release Process

The following describes the steps required to release a new version of `web3.js`. It is followed to adhere to community standards and expectations.

## Release Candidate (RC) Release Procedure

1.  Create a GitHub draft release.
    1.  [Example](https://github.com/ethereum/web3.js/releases/tag/v1.2.7-rc.0) - should contain at a minimum: release notes, changelog, any other important notes.
    1.  Request review on the draft release from a web3.js contributor ([@cgewecke](https://github.com/cgewecke)) for completeness, grammar, etc.
1.  Create release branch (e.g. `release/1.2.7`).
1.  Update and commit `CHANGELOG.md`.
    1.  Move section header `[Unreleased]` to bottom.
    1.  Add next anticipated release version number to bottom (as a placeholder for new changelog entries).
1.  In the project root, run `npm run build` and commit changes after using a commit message like: `Build for 1.0.0-rc.0`
    1. The next step will also build each package, but Lerna makes the tagged commit before building the packages (so they're not included)
3.  Create release commit and tags e.g. `lerna version 1.2.7-rc.0 --no-push`
    1.  (updates package version numbers, builds minified file (for `1.x`), creates release commit and tags.)
4.  Push release branch to origin with tags `git push origin release/1.2.7 --follow-tags`.
5.  Create release PR as draft ([example](https://github.com/ethereum/web3.js/pull/3351)).
6.  Ensure CI is green / passing.
    1.  (spend time here inspecting the CI logs to ensure everything looks valid and results were reported correctly)
7.  Run `npm run publish from-package -- --dist-tag rc`.
    1. Lerna can sometimes have difficulty with the number of packages we have. If the above command is unsuccessful, for every unpublished package run: `lerna publish --scope="package-name"` `npm dist-tag add <package-name>@<version> rc`)
8.  Publish the GitHub release.
9.  A GitHub Webhook should trigger the ReadTheDocs build after the release is published.
    1.  (The build may sometimes need to be manually triggered in ReadTheDocs admin panel. If the version does not appear, create a build of a previous version to refresh the list.)
    1.  Activate the new version.
10.  Request PR review from key contributors:
    1.  Chris from EthereumJS ([@cgewecke](https://github.com/cgewecke))
    1.  Patricio from Nomic Labs ([@alcuadrado](https://github.com/alcuadrado))
    1.  Michael from Embark ([@michaelsbradleyjr](https://github.com/michaelsbradleyjr))
    1.  Nicholas from Truffle ([@gnidan](https://github.com/gnidan))
    1.  If touches or affects ENS: Nick Johnson ([@Arachnid](https://github.com/Arachnid))
11.  Wait 1 week for community discourse and 2 reviewer approvals.
    1.  (if release is an emergency patch, time limit may be reduced relative to severity.)

## Formal Release Procedure

1.  Create GitHub draft release from text of `rc` release.
1.  Checkout release branch (e.g. `release/1.2.7`).
1.  Create and push release commit and tags: `lerna version 1.2.7 --force-publish --no-push`
1.  Push release branch to origin with tags `git push origin release/1.2.7 --follow-tags`.
1.  Publish the GitHub release.
1.  A GitHub Webhook should trigger the ReadTheDocs build after the release is published.
    1.  (The build may sometimes need to be manually triggered in ReadTheDocs admin panel. If the version does not appear, create a build of a previous version to refresh the list.)
    1.  Activate the new version.
    1.  Set the version to default.
1.  Run `npm run publish from-package`.
1.  Merge release PR.
1.  Share the release announcement on:
    1.  (_Note:_ There is a delay on npm between different regions, so all may not see the release immediately.)
    1.  Twitter
    1.  Gitter
    1.  Ethereum JavaScript Community (EJC) Discord
    1.  Reddit
    1.  Depending on release's significance to certain projects, write to:
        1.  Fabio from 0x ([@fabioberger](https://github.com/fabioberger))
        1.  Santiago from OpenZeppelin ([@spalladino](https://github.com/spalladino))
        1.  Pedro from WalletConnect ([@pedrouid](https://github.com/pedrouid))
        1.  Josh from FunFair ([@joshstevens19](https://github.com/joshstevens19))
        1.  Truffle, Gnosis, Aragon, Embark, Alchemy, Buidler, Remix
