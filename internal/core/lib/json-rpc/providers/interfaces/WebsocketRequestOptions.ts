import * as http from 'http';
import * as https from 'https';
import WebsocketHeaders from "./WebsocketHeaders";

export default interface WebsocketRequestOptions  {
    agent: http.Agent | https.Agent | boolean;
    auth: string;
    createConnection: Function;
    defaultPort: number;
    family: number;
    headers: WebsocketHeaders;
    host: string;
    hostname: string;
    localAddress: string;
    lookup: Function;
    maxHeaderSize: number;
    method: string;
    path: string;
    port: number;
    protocol: string;
    setHost: boolean;
    socketPath: string;
    timeout: number;
}