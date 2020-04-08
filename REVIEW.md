# Review Guidelines

Our review guidelines are intended to provide clear steps for PR proposers and reviewers.

## Rules

*   PR follows the provided [template](.github/PULL_REQUEST_TEMPLATE.md).
*   PR doesn't contain unneccessary changes.
*   The changed code preserves the conventions and stylistic consistency of the project.
*   PR must use labels accordingly.
    *   Missing labels may be suggested to be created.
*   Any PR that introduces a logic change should include unit and e2e tests.
    *   A decrease of the code coverage rate is not allowed.
    *   The error case is always tested.
    *   The description of the test case is self-describing.
    *   Test cases are grouped for clarity.
*   Only PRs that are not in draft mode should be reviewed.
*   A PR may only be merged if the following conditions are fulfilled:
    *   The correct base branch is selected.
    *   Any new files contain the web3.js file header.
    *   The documentation was updated (if required).
    *   The CHANGELOG was updated accordingly.
    *   The CI with QA passes succesfully.
    *   All comments have been addressed.
    *   Doesn't add undue maintenance burden.
    *   Doesn't increase the bundle size or is clearly explained why.
