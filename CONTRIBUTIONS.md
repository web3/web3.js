## Guidelines for Pull Requests and Releases (Web3 1.x)

This document provides some ground rules for contributors (including the maintainer(s) of
the project) about how to make, review and publish changes to 1.x. The most basic requirement is
that **Web3 not break**.

### Pull Requests for substantive changes (e.g. everything except comments and docs)

1.  Any PR that introduces a logic change should include tests. (In many cases, the tests will take more time to write than the actual code).
1.  All PRs should sit for 72 hours with the `pleasereview` tag in order to garner feedback.
1.  No PR should be merged until it has been reviewed, passes CI, and all reviews' comments are
    addressed.
1.  PRs should:
    1.  have a narrow, well-defined focus.
    1.  make the smallest set of changes possible to achieve their goal.
    1.  include a clear description in the opening comment.
    1.  preserve the conventions and stylistic consistency of any files they modify.
1.  Given the choice between a conservative change that mostly works and an adventurous change which seems better but introduces uncertainty - prefer the conservative change.

### Reviews

The end goal of review is to suggest useful improvements to the author. Reviews should finish with approval unless there are issues that would result in:

1.  Buggy behaviour.
1.  Undue maintenance burden.
1.  Pessimisation (i.e. speed reduction / meaningful build-size increases).
1.  Feature reduction (i.e. it removes some aspect of functionality that users rely on).
1.  Avoidable risk (i.e it's difficult to test or hard to anticipate the implications of, without
    being strictly necessary to fix something broken).

Read more in [Review Guidelines](./REVIEW.md).

### Releases

1.  All releases should be proposed in a PR and subject to community review for a minimum of one week.
1.  Release review periods should be accompanied by a published `rc` version which can be used for sanity checks / additional testing.
1.  During release review, the code is frozen unless new changes are proposed, approved and merged.
1.  Changes should trigger a new `rc` release and set the release clock back enough that reviewers have the time they need to test new changes.
1.  Regular maintainers should manually test the `rc` against a Node project and the published
    minified bundle in a browser context. An external reviewer should verify they've done the same.
1.  A release PR must be approved at least by two known contributors of the web3.js project.

Read more in [Release Guidelines](./RELEASE.md).

### Emergencies

Emergency releases are allowed to shorten waiting periods depending on the severity of the issue.

There is precedent set for this in the 1.2.6 release (see [#3351](https://github.com/ethereum/web3.js/pull/3351)), where the consensus view was to make the smallest change necessary to address the emergency while waiving the `rc` process (meaning many existing additions to master were excluded).

This topic is under further org-wide discussion at [ethereum/js-organization#6](https://github.com/ethereum/js-organization/issues/6).
