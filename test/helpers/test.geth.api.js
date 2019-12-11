//Helpers to make RPC calls for non-standard geth apis
const wait = require('./test.utils').wait;

let adminWeb3;

// Methods
async function send(_web3, packet){
  return new Promise((resolve, reject) => {
    _web3.currentProvider.send(packet, (err, res) => {
      if (err !== null) return reject(err);
      return resolve(res);
    });
  });
}

// Opens own RPC connection
async function connectHTTP(Web3, port){
  adminWeb3 = new Web3('http://localhost:' + port);
}

// RPC Packets
const wsStartPacket = {
    jsonrpc: "2.0",
    method: "admin_startWS",
    params: [],
    id: new Date().getTime()
};

const wsStopPacket = {
    jsonrpc: "2.0",
    method: "admin_stopWS",
    params: [],
    id: new Date().getTime()
}

// Admin API Endpoints to open and close ws connections over RPC

// wsStart with the http connection, since we're using the
// ws connection to close and it will be broken when we want to start again.
async function wsStart(){
  await send(adminWeb3, wsStartPacket);
  await wait(250);
}

// wsStop with the ws connection created in the test so the relevant instance
// definitely hears the close event, definitely runs the close logic.
async function wsStop(testWeb3){
  await send(testWeb3, wsStopPacket);
}

// Stop and swallow error so we don't have to wrap wsStop in a try catch everywhere.
async function wsStopQuietly(testWeb3){
  try { await send(testWeb3, wsStopPacket) } catch (err){}
}


const admin = {
    wsStart: wsStart,
    wsStop: wsStop,
    wsStopQuietly: wsStopQuietly
}

// Exports
module.exports = {
  admin: admin,
  connectHTTP: connectHTTP
}
