import { OutgoingHttpHeaders } from "http";
import { IClientConfig } from "websocket";
import { ProviderOptions } from "../../web3-providers-base/lib/types";

export type WebSocketOptions = ProviderOptions  & {
    protocol?: string;
    headers?: OutgoingHttpHeaders;
    requestOptions?: object;
    clientConfig?: IClientConfig;
};