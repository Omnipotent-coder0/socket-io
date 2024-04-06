import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const server_url = import.meta.env.VITE_SERVER_URL;

function App() {
  const socket = useMemo(() => io(server_url), []);
  // const socket = io(server_url);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(message);
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  };

  const handleRoomSubmit = (e)=>{
    e.preventDefault();
    socket.emit("join room",roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User is connected at socket : ", socket.id);
      setSocketId(socket.id);
    });


    socket.on("recieved message", (data) => {
      console.log(data);
      console.log("message : ",messages);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("new user", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center m-5">
        {socketId}
      </h1>

      <form onSubmit={handleRoomSubmit} >
        <label htmlFor="roomName" id='roomName'>Room Name : </label>
        <input type="text" name='roomName' value={roomName} onChange={(e) => setRoomName(e.target.value)} className='border-2 border-black/50 ' />
        <button type='submit' className='py-1 px-3 m-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold'>Send</button>
      </form>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="message" id='message'>Input : </label>
        <input type="text" name='message' value={message} onChange={(e) => setMessage(e.target.value)} className='border-2 border-black/50 ' /><br />
        <label htmlFor="room" id='room'>Room : </label>
        <input type="text" name='room' value={room} onChange={(e) => setRoom(e.target.value)} className='border-2 border-black/50 ' /><br />
        <button type='submit' className='py-1 px-3 m-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold'>Send</button>
      </form>

      <div className='flex flex-col'>
        {
          messages.map((m, index) => (
            <p key={index}>{m}</p>
          ))
        }
      </div>
    </>
  );
};

export default App
