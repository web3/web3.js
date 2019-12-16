import JsonRpcPayload from "./JsonRpcPayload";

export default interface RequestItem {
    payload: JsonRpcPayload;
    resolve: Function;
    reject: Function;
}