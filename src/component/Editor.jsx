import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Editor = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const user = useSelector((store) => store?.user);
  const [langId, setLangId] = useState(50);
  const [output, setOutput] = useState("");

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
    <div className="h-screen flex">
      {/* Left Sidebar for Users */}
      <div className="w-[10%] bg-gray-900 text-white p-4">
        <h3 className="text-lg font-bold mb-2">Users</h3>
        <div className="flex flex-col gap-2">
          {connectedUsers.length > 0 ? (
            connectedUsers.map((user, index) => (
              <button
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm
              ${
                user.isOwner
                  ? "bg-yellow-600 text-white font-bold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              >
                <span className="text-green-400 text-xs">🟢</span>
                {user.name}
              </button>
            ))
          ) : (
            <p className="text-sm italic">No users connected</p>
          )}
        </div>
      </div>

      {/* Right Section - Code Editor */}
      <div className="w-[90%] ">
        <div className="flex justify-between">
          <div className="flex ">
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
        <CodeMirror
          value={code}
          height="350px"
          theme={oneDark}
          extensions={[javascript()]}
          onChange={handleCodeChange}
        />

        <OutputSection result={output} />
      </div>
    </div>
  );
};

const OutputSection = ({ result }) => {
  return (
    <div className="h-40 border border-black m-2 bg-white rounded-md">
      <h1>Output:</h1>
      <h1 className="text-red-500">{result}</h1>
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
