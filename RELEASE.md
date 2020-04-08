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
|   2.x   | Alpha Preview |  13. Jul. 2019  |      TBD      |     TBD     |

## Deprecation Rules

Because breaking changes are always happening during the development of a project it is required to define rules on how we inform depending projects about coming changes with enough time to react. This doesn't mean that we plan to introduce breaking changes but sometimes they are required.

1.  Deprecations will be announced in our `CHANGELOG` and in the description of a release.
2.  Deprecated functionalities should be marked in the developer documentation, function documentation, and the related types as deprecated.
3.  A deprecated functionality stays deprecated for the next `X (TBD)` increases of the minor version.

# web3.js Release Process

The following describes the steps required to release a new version of `web3.js`. It is followed to adhere to community standards and expectations.

## Release Procedure

1.  Create release branch (e.g. `release/1.2.7`)
1.  Change version number in `packages/web3/package.json`
1.  Create minified build from release branch
    1.  Run `npm run build` (runs gulp task)
    1.  (for `1.x`, ensure minified file is available in release PR since some projects will use for release candidate tests. for `2.x`, no minified file is needed.)
1.  Update root package version in `package.json`
1.  Create release PR ([example](https://github.com/ethereum/web3.js/pull/3351))
    1.  Request review from key contributors:
        1.  Chris from EthereumJS ([@cgewecke](https://github.com/cgewecke))
        1.  Michael from Embark ([@michaelsbradleyjr](https://github.com/michaelsbradleyjr))
        1.  Nicholas from Truffle ([@gnidan](https://github.com/gnidan))
        1.  Patricio from Nomic Labs ([@alcuadrado](https://github.com/alcuadrado))
        1.  If touches or affects ENS: Nick Johnson ([@Arachnid](https://github.com/Arachnid))
1.  Check `npm run build-all` runs with success
    1.  (tests if webpack can bundle each standalone package)
1.  Ensure CI is green / passing.
    1.  (spend time here inspecting the CI logs to ensure everything looks valid and results were reported correctly)
1.  Wait 1 week for community discourse and 2 reviewer approvals.
    1.  (if release is an emergency patch, time limit may be reduced relative to its severity.)
1.  Run `npm run release`
1.  Run `git push` of release commit
    1.  Ensure tags (created automatically by lerna) are pushed.
    1.  e.g.`git push ethereum release/1.2.7 --follow-tags`
1.  For `rc`, release on GitHub and nowhere else.
1.  For non-`rc`, save a new release to `Draft` and request review from web3.js contributor ([@cgewecke](https://github.com/cgewecke)) for grammar, etc.
1.  After release, a GitHub Webhook triggers ReadTheDocs build
    1.  (may sometimes need to be manually triggered in ReadTheDocs admin panel)
    1.  Activate version
    1.  Set version to default if release is `minor` or `major`
1.  Apply appropriate `npm` tags to release
    1.  Try e.g. `lerna publish --dist-tag rc` - if unsuccessful, run once for every package: `npm dist-tag add <package-name>@<version> rc`
1.  Share the release announcement on:
    1.  (_note:_ there is a delay on npm between different regions, so all may not see the release immediately)
    1.  Twitter
    1.  Gitter
    1.  Ethereum JavaScript Community (EJC) Discord
    1.  Reddit
    1.  Depending on release's significance to certain projects, write to:
        1.  Fabio from 0x ([@fabioberger](https://github.com/fabioberger))
        1.  Santiago from OpenZeppelin ([@spalladino](https://github.com/spalladino))
        1.  Pedro from WalletConnect ([@pedrouid](https://github.com/pedrouid))
        1.  Josh from FunFair ([@joshstevens19](https://github.com/joshstevens19))
        1.  Truffle, Gnosis, Aragon, Embark, Alchemy
        1.  EF projects: Buidler, Remix, Play, Grid
