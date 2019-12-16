import WebsocketRequestOptions from "./WebsocketRequestOptions";
import WebsocketClientConfig from "./WebsocketClientConfig";
import ReconnectOptions from "./ReconnectOptions";
import WebsocketHeaders from "./WebsocketHeaders";

export default interface WebsocketProviderOptions {
    host?: string;
    timeout?: number;
    reconnect?: ReconnectOptions;
    headers?: WebsocketHeaders;
    protocol?: string | string[];
    clientConfig?: WebsocketClientConfig;
    requestOptions?: WebsocketRequestOptions;
    origin?: string;
}
