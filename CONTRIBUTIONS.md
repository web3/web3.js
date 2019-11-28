## Guidelines for Pull Requests and Releases (Web3 1.x)

This document provides some ground rules for contributors (including the maintainer(s) of
the project) about how to make, review and publish changes to 1.x. The most basic requirement is
that **Web3 not break**.

### Pull Requests for substantive changes (e.g. everything except comments and docs)

1. Any PR that introduces a logic change should include tests. (In many cases, the tests will take
more time to write than the actual code).

2. All PRs should sit for 72 hours with the `pleasereview` tag in order to garner feedback.

3. No PR should be merged until it has been reviewed, passes CI, and all reviews' comments are
addressed.

4. PRs should have a narrow, well-defined focus and make the smallest set of changes possible to achieve their goal. They should include a clear description in the opening comment.

5. Given the choice between a conservative change that mostly works and an adventurous change which
seems better but introduces uncertainty - prefer the conservative change.

### Reviews

The end-goal of review is to suggest useful improvements to the author. Reviews should finish with
approval unless there are issues that would result in:

1. Buggy behaviour.

2. Undue maintenance burden.

3. Pessimisation (i.e. speed reduction / meaningful build-size increases).

4. Feature reduction (i.e. it removes some aspect of functionality that users rely on).

5. Avoidable risk (i.e it's difficult to test or hard to anticipate the implications of, without
being strictly necessary to fix something broken).

### Releases

1. All releases should be proposed in a PR and subject to community review for a minimum of 72 hours (3 days). 

2. Release review periods should be accompanied by a published `rc` version which can be used for
sanity checks / additional testing.

3. During release review, the code is frozen unless new changes are proposed, approved and merged.
Changes reset the release clock and should trigger a new `rc` release.

4. Regular maintainers should manually test the `rc` against a Node project and the published
minified bundle in a browser context. An external reviewer should verify they've done the same.
5. A release PR does have to be approved at least by two known contributors of the web3.js project

### Emergencies

This topic is under org-wide discussion at https://github.com/ethereum/js-organization/issues/6

(Much of the above is borrowed from Openish, Parity and Ethers contributions docs. It's meant
to establish clear, egalitarian criteria for making changes to the code while prioritizing the
safety of Web3's users.)
