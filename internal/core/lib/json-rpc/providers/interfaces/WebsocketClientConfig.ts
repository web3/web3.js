
export default interface WebsocketClientConfig {
    webSocketVersion?: number;
    maxReceivedFrameSize?: number;
    maxReceivedMessageSize?: number;
    fragmentOutgoingMessages?: boolean;
    fragmentationThreshold?: number;
    assembleFragments?: boolean;
    closeTimeout?: number;
    tlsOptions?: any;
}
