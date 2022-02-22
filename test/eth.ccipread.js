describe('ccip read', () => {
    describe('isOffChainLookup', () => {
        it.todo('should retrun true if is off-chain lookup');
    });

    describe('callGateway', () => {
        it.todo('should handle bad gateway url');
        it.todo('should handle 4xx error');
        it.todo('should throw if all urls fail');
        it.todo('should send GET request if {data} is in the url template');
        it.todo('should send POST request if {data} is not in the url');
        it.todo('should substitute {sender} if in url');

        it.todo('should allow call if allow list and block list are NOT provided');

        describe('Allow list', () => {
            it.todo('should allow call if no allow list is provided');
            it.todo('should allow call if allow list is provided and domain is on allow list');
            it.todo('should NOT allow call if allow list is provided and domain is NOT on allow list');
        });
    });

    describe('CCIPRead', () => {
        it.todo('should not exceed the maximum retry count');

        it.todo('should handle mainnet error correctly');

        it.todo('should handle error in response data');

        it.todo('should handle error when on error object');

        it.todo('should handle network errors');

        it.todo('should handle failing urls in the url list');

        it.todo('should respond to GET/POST templates correctly')
    });
});
