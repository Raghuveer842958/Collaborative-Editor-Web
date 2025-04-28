import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate random room ID

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  // Function to join a room
  const handleJoinRoom = () => {
    if (roomId.trim()) navigate(`/editor/${roomId}`);
  };

  // Function to create a new room (Generate a random ID)
  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); // Generate unique room ID
    navigate(`/editor/${newRoomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-white">Collaborative Code Editor</h1>

      {/* Input for Room ID */}
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 mb-4 w-64 text-center"
      />

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Join Room
        </button>
        <button
          onClick={handleCreateRoom}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default Room;
