# Review Guidelines

Our review guidelines are intended to provide clear steps for PR proposers and reviewers.

Only published PRs will be considered for review. Draft PRs will be considered in-progress and not yet ready for review.

## Rules

*   [ ] PR follows the provided [template](.github/PULL_REQUEST_TEMPLATE.md).
*   [ ] PR doesn't contain unneccessary changes.
*   [ ] The changed code preserves the conventions and stylistic consistency of the project.
*   [ ] PR uses labels accordingly. (new labels may be suggested)
*   [ ] PR includes unit and e2e tests if related to any logic changes.
    *   [ ] The code coverage rate did not decrease.
    *   [ ] The error case is always tested.
    *   [ ] The description of the test case is self-describing.
    *   [ ] Test cases are grouped for clarity.
*   [ ] A PR may only be merged if the following conditions are fulfilled:
    *   [ ] The correct base branch is selected.
    *   [ ] Any new files contain the web3.js file header.
    *   [ ] The documentation was updated (if applicable).
    *   [ ] The CHANGELOG was updated accordingly.
    *   [ ] The CI with QA passes succesfully.
        *   [ ] The CI logs were manually checked to ensure false positives were not reported.
    *   [ ] All comments have been addressed.
    *   [ ] Doesn't add undue maintenance burden.
    *   [ ] Doesn't increase the bundle size or is clearly explained why.
