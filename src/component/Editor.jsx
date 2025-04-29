import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import VideoCall from "./VideoCall";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const Editor = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const user = useSelector((store) => store?.user);
  const [langId, setLangId] = useState(50);
  const [output, setOutput] = useState("");

  const [userStreams, setUserStreams] = useState({});

  const handleUserStream = (userId, stream) => {
    setUserStreams((prev) => ({
      ...prev,
      [userId]: stream,
    }));
  };

  const supportedLanguage = [
    {
      name: "JS",
      id: 63,
      defaultCode: `console.log("Hello, World!");`,
    },
    {
      name: "TS",
      id: 74,
      defaultCode: `console.log("Hello, World!");`,
    },
    {
      name: "C",
      id: 50,
      defaultCode: `#include <stdio.h>
                    int main() {
                        printf("Hello, World!\\n");
                        return 0;
                    }`,
    },
    {
      name: "C++",
      id: 54,
      defaultCode: `#include <iostream>
                    using namespace std;
                    int main() {
                        cout << "Hello, World!" << endl;
                        return 0;
                    }`,
    },
    {
      name: "PY",
      id: 71,
      defaultCode: `print("Hello, World!")`,
    },
    {
      name: "JAVA",
      id: 62,
      defaultCode: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
        }
      }`,
    },
    {
      name: "C#",
      id: 51,
      defaultCode: `using System;
                    class Program {
                        static void Main() {
                            Console.WriteLine("Hello, World!");
                        }
                    }`,
    },
  ];

  const [socket, setSocket] = useState(null); // 👈 store socket here

  useEffect(() => {
    try {
      console.log("use Effetct Called!!!");
      console.log("Language is is :", langId);
      const socket = createSocketConnection();
      setSocket(socket); // 👈 set the socket once
      socket.emit(
        "join-room",
        roomId,
        user?.user?._id,
        user?.user?.userName,
        langId
      );

      socket.on("load-code", (loadedCode) => {
        setCode(loadedCode);
      });

      socket.on("code-update", (updatedCode) => {
        setCode(updatedCode);
      });

      socket.on("user-list", (userList) => {
        setConnectedUsers(userList);
        // addRoomUsers(userList);
        console.log("User list is:", userList);
      });

      socket.on("show-output", (result) => {
        console.log("result is :", result);
        if (result?.success) {
          setOutput(result?.output);
        }
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.log("Error in useEffect Block");
    }
  }, [roomId]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit("code-change", { roomId, code: value });
    }
  };

  const changeLanguage = (roomId, langId) => {
    console.log("change language handler called");
    if (socket) {
      setLangId(langId);
      socket.emit("change-language", roomId, langId);
    }
  };

  const handleRunCode = async () => {
    try {
      console.log("langId is :", langId);
      console.log("source code is :", code);

      if (socket) {
        socket.emit("execute-code", roomId, langId, code);
      }
    } catch (error) {
      console.log("Error in executing the code :", error.message);
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full w-full">
        {/* Left Sidebar Panel */}
        <Panel defaultSize={20} minSize={10} maxSize={30}>
          <div className="h-full bg-gray-900 text-white p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Participants</h3>
            <div className="flex flex-col gap-4">
              {connectedUsers.length > 0 ? (
                connectedUsers.map((userObj, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span
                      className={`text-sm mb-1 font-semibold ${
                        userObj.isOwner ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {userObj.name}
                    </span>
                    {userStreams[userObj.id] ? (
                      <video
                        autoPlay
                        playsInline
                        muted={user?.user?._id === userObj.id}
                        ref={(videoEl) => {
                          if (videoEl)
                            videoEl.srcObject = userStreams[userObj.id];
                        }}
                        className="w-full h-24 rounded-md border border-white"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-300">
                        No video
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm italic">No users connected</p>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize" />

        {/* Editor + Output Section */}
        <Panel defaultSize={80} minSize={50}>
          <PanelGroup direction="vertical" className="h-full w-full">
            {/* Code Editor Section */}
            <Panel defaultSize={70} minSize={40}>
              <div className="flex flex-col h-full">
                {/* Language Select + Run Button */}
                <div className="flex justify-between p-2">
                  <div className="flex">
                    {supportedLanguage.map((lang) => (
                      <div
                        onClick={() => changeLanguage(roomId, lang.id)}
                        key={lang.id}
                      >
                        <LanguageIcon name={lang.name} id={lang.id} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="border border-black rounded-md px-6 py-1 m-1 bg-green-500"
                    onClick={handleRunCode}
                  >
                    Run
                  </button>
                </div>

                <VideoCall
                  roomId={roomId}
                  user={user}
                  onUserStream={handleUserStream}
                />

                {/* 👇 Scrollable code editor area */}
                <div className="flex-1 overflow-auto">
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={oneDark}
                    extensions={[javascript()]}
                    onChange={handleCodeChange}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 bg-gray-700 cursor-row-resize" />

            {/* Output Section */}
            <Panel defaultSize={30} minSize={10}>
              <OutputSection result={output} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

const OutputSection = ({ result }) => {
  return (
    <div className="w-full h-full overflow-auto border border-black m-2 bg-white rounded-md p-2">
      <h1 className="font-semibold mb-2">Output:</h1>
      <pre className="text-red-500 whitespace-pre-wrap">{result}</pre>
    </div>
  );
};

const LanguageIcon = ({ name }) => {
  return (
    <div className="h-10 w-10 border border black m-1 py-1 px-2 flex flex-items-center justify-center rounded-md">
      <button>{name}</button>
    </div>
  );
};

export default Editor;
