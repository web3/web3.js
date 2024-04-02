# Contributing

Thank you for contributing to Web3.js! We appreciate your interest and welcome any contributions that can help improve our documentation, functionality, address bugs, or any other aspects that can contribute to the overall improvement of our project. Before you start contributing, please take a moment to review the guidelines below.

## Help and Support

If you face any issues while contributing or want any type of support, we encourage you to join our [Discord Community](https://discord.com/invite/3shNX8cqGR), ask any question in the `#web3js-general` channel, and/or submit a [new issue](https://github.com/web3/web3.js/issues/new).

## Prerequisites

- [NodeJS](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/)

## Contributing to the docs

1. **Fork the docs:** Start by forking our repository to your GitHub account.

2. **Clone the repo:** Clone the forked repository to your local machine using the following command:
```bash
git clone https://github.com/your-username/web3.js.git
```
3. **Create a Branch:** Create a new branch for your changes with a descriptive name.
    **NOTE: The branch name must include the issue number (if there is no issue created for your contribution, please create one).**
```bash
git checkout -b issue-name-1234
```
4. **Navigate to the docs folder:** `cd web3.js/docs/docs`

5. **Install dependencies:** 
```bash
yarn
```
6. **Make your changes:**...

7. Check changes in the local environment: Run the command `yarn start` and you'll see a local environment in `localhost:3000` with the documents.

8. **Commit your changes:** `git add .` and `git commit -m 'descriptive msg'` 

9. **Push your changes:**
```bash
git push origin branch-name
```

10. **Open a Pull Request (PR):** Provide a detailed description of your changes, the problem you are solving, and any additional context (you can use the PR template).

11. **Wait for review**: Before merging any branch into the main branch, it must be approved by two devs, after it is successfully approved, you can `Squash and merge` your branch, Please be responsive to any feedback on your pull request and make necessary changes based on the review.

## Guidelines for Pull Requests and Releases (Web3 4.x)

This document provides some ground rules for contributors (including the maintainer(s) of
the project) about how to make, review and publish changes to 4.x. The most basic requirement is
that **Web3 not break**.

### Pull Requests for substantive changes (e.g. everything except comments and docs)

1.  Any PR that introduces a logic change should include tests. (In many cases, the tests will take more time to write than the actual code).
1.  All PRs should sit for 72 hours with the `please review` tag to garner feedback.
1.  No PR should be merged until it has been reviewed, passes CI, and all reviews' comments are
    addressed.
1.  PRs should:
    1.  have a narrow, well-defined focus.
    1.  make the smallest set of changes possible to achieve their goal.
    1.  include a clear description in the opening comment.
    1.  preserve the conventions and stylistic consistency of any files they modify.
1.  Given the choice between a conservative change that mostly works and an adventurous change that seems better but introduces uncertainty - prefer the conservative change.

### Reviews

The end goal of the review is to suggest useful improvements to the author. Reviews should finish with approval unless there are issues that would result in:

1.  Buggy behavior.
1.  Undue maintenance burden.
1.  Pessimisation (i.e. speed reduction or meaningful build-size increases).
1.  Feature reduction (i.e. it removes some aspect of functionality that users rely on).
1.  Avoidable risk (i.e. it's difficult to test or hard to anticipate the implications of, without
    being strictly necessary to fix something broken).

Read more in [Review Guidelines](./REVIEW.md).

### Releases

1.  All releases should be proposed in a PR and subject to community review for a minimum of one week.
1.  Release review periods should be accompanied by a published `rc` version which can be used for sanity checks / additional testing.
1.  During release review, the code is frozen unless new changes are proposed, approved and merged.
1.  Changes should trigger a new `rc` release and set the release clock back enough that reviewers have the time they need to test new changes.
1.  Regular maintainers should manually test the `rc` against a Node project and the published
    minified bundle in a browser context. An external reviewer should verify they've done the same.
1.  A release PR must be approved at least by two known contributors to the web3.js project.

Read more in the [Release Guidelines](./RELEASE.md).

### Emergencies

Emergency releases are allowed to shorten waiting periods depending on the severity of the issue.

There is precedent set for this in the 1.2.6 release (see [#3351](https://github.com/ethereum/web3.js/pull/3351)), where the consensus view was to make the smallest change necessary to address the emergency while waiving the `rc` process (meaning many existing additions to master were excluded).

This topic is under further org-wide discussion at [ethereum/js-organization#6](https://github.com/ethereum/js-organization/issues/6).

