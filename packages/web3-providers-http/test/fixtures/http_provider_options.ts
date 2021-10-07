export const httpProviderOptions = {
    providerOptions: ({
        body: null,
        cache: 'force-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        integrity: 'foo',
        keepalive: true,
        method: 'GET',
        mode: 'same-origin',
        redirect: 'error',
        referrer: 'foo',
        referrerPolicy: 'same-origin',
        signal: null,
        window: null
    } as RequestInit)
};
