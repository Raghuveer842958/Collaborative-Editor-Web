// // components/VideoCall.js
// import React, { useEffect, useRef, useState } from "react";
// import Peer from "simple-peer";
// import { createSocketConnection } from "../utils/socket";

// const VideoCall = ({ roomId, user }) => {
//   const [stream, setStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const socketRef = useRef();
//   const peerRef = useRef();

//   useEffect(() => {
//     socketRef.current = createSocketConnection();

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);
//         myVideo.current.srcObject = currentStream;

//         socketRef.current.emit("join-call", roomId, user?.user?._id);

//         socketRef.current.on("user-joined", (userId) => {
//           const peer = createPeer(userId, socketRef.current.id, currentStream);
//           peerRef.current = peer;
//         });

//         socketRef.current.on("signal", ({ from, signal }) => {
//           if (!peerRef.current) {
//             const peer = addPeer(signal, from, currentStream);
//             peerRef.current = peer;
//           } else {
//             peerRef.current.signal(signal);
//           }
//         });
//       });

//     return () => {
//       stream?.getTracks()?.forEach((track) => track.stop());
//       socketRef.current.disconnect();
//     };
//   }, []);

//   function createPeer(userToSignal, callerID, stream) {
//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on("signal", (signal) => {
//       socketRef.current.emit("sending-signal", {
//         userToSignal,
//         callerID,
//         signal,
//       });
//     });

//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//       setRemoteStream(stream);
//     });

//     return peer;
//   }

//   function addPeer(incomingSignal, callerID, stream) {
//     const peer = new Peer({ initiator: false, trickle: false, stream });

//     peer.on("signal", (signal) => {
//       socketRef.current.emit("returning-signal", { signal, callerID });
//     });

//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//       setRemoteStream(stream);
//     });

//     peer.signal(incomingSignal);

//     return peer;
//   }

//   return (
//     <div className="flex gap-4">
//       <video muted ref={myVideo} autoPlay playsInline className="w-1/2" />
//       <video ref={userVideo} autoPlay playsInline className="w-1/2" />
//     </div>
//   );
// };

// export default VideoCall;


import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { createSocketConnection } from "../utils/socket";

const VideoCall = ({ roomId, user, onUserStream }) => {
  const [stream, setStream] = useState(null);
  const socketRef = useRef();
  const peersRef = useRef({});

  useEffect(() => {
    socketRef.current = createSocketConnection();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (onUserStream) {
          onUserStream(user?.user?._id, currentStream); // pass your own stream to parent
        }

        socketRef.current.emit("join-call", roomId, user?.user?._id);

        socketRef.current.on("user-joined", (userId) => {
          if (peersRef.current[userId]) return;

          const peer = createPeer(userId, socketRef.current.id, currentStream);
          peersRef.current[userId] = peer;
        });

        socketRef.current.on("signal", ({ from, signal }) => {
          if (!peersRef.current[from]) {
            const peer = addPeer(signal, from, currentStream);
            peersRef.current[from] = peer;
          } else {
            peersRef.current[from].signal(signal);
          }
        });
      });

    return () => {
      stream?.getTracks()?.forEach((track) => track.stop());
      socketRef.current.disconnect();
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending-signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (onUserStream) {
        onUserStream(userToSignal, remoteStream);
      }
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning-signal", { signal, callerID });
    });

    peer.on("stream", (remoteStream) => {
      if (onUserStream) {
        onUserStream(callerID, remoteStream);
      }
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return null; // Don't render anything directly here
};

export default VideoCall;
