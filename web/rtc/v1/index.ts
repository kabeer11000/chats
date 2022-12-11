import Peer from "peerjs";

export const CreatePeer = async (id: string) => {
    // const Peer = await import('peerjs').then(({default: Peer}) => Peer);
    const peer = new Peer(id, {
        host: '192.168.40.50',
        port: 8001,
        path: '/chats',
        pingInterval: 10000
    });
    // peer.on('open', function(id) {
    //     console.log('My peer ID is: ' + id);
    // });
    await new Promise((resolve => peer.on('open', id => {
        console.log('My peer ID is: ' + id);
        resolve(id);
    })));
    return peer;
}