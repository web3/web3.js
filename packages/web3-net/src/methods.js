module.exports = [
    {
        name: 'getId',
        call: 'net_version',
        params: 0,
        outputFormatter: parseInt,
    },
    {
        name: 'isListening',
        call: 'net_listening',
        params: 0
    },
    {
        name: 'getPeerCount',
        call: 'net_peerCount',
        params: 0,
        outputFormatter: 'hexToNumber',
    }
]
