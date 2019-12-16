import JsonRpcPayload from "./JsonRpcPayload";
import JsonRpcResponse from "./JsonRpcResponse";

export default interface RequestItem {
    payload: JsonRpcPayload;
    resolve: (value: JsonRpcResponse) => unknown;
    reject: (value: Error) => unknown;
}