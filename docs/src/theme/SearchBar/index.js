import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import AskCookbook from '@cookbookdev/docsbot/react';

// This is a public key, so it's safe to hardcode it.
// To get a new one or request access to the internal portal (If you work for the Web3JS), contact the cookbook.dev team at tyler@cookbook.dev.
const ASK_COOKBOOK_PUBLIC_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjdjNzc3YzNmOGY3Mzk2MGYzZGNiOGYiLCJpYXQiOjE3MTk0MzMwODQsImV4cCI6MjAzNTAwOTA4NH0.OXWVNJMxMuEGG1oWetW_a9005r8hmQ6RbF19wbrpTlk';

export default function SearchBarWrapper(props) {
    return (
        <>
            <SearchBar {...props} />
            <AskCookbook apiKey={ASK_COOKBOOK_PUBLIC_KEY} />
        </>
    );
}
