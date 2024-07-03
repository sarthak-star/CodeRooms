import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {

  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setclients] = useState([]);
  const { roomId } = useParams();
  const codeRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        navigate('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
        if (userName !== location.state?.userName) {
          toast.success(`${userName} joined`);
        }
        setclients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left`);
        setclients((prev) => {
          return prev.filter(client => client.socketId !== socketId);
        })
      })

    }
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  async function handleCopyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  function handleLeaveRoom() {
    navigate('/');
  }

  return (
    <div className='w-screen h-screen overflow-hidden flex bg-slate-950'>
      <div className='w-1/6 flex flex-col p-7 justify-between' >
        <div className='space-y-4'>
          <div>
            <img className='w-[70px] h-[70px] rounded-full' src="/logo.jpeg" alt="logoImg" />
          </div>
          <h4 className='text-[#A41445] font-bold text-2xl' >Connected Peeps</h4>
          <div className='space-y-4' >
            {
              clients.map((client) => (
                <Client key={client.socketId} userName={client.userName} />
              ))
            }
          </div>
        </div>
        <div className='flex flex-col space-y-3'>
          <button className='bg-slate-200 rounded-xl p-3 font-bold text-[#A41445] text-xl'  onClick={handleCopyRoomId} >Copy Room Id</button>
          <button className='bg-red-600 rounded-xl p-3 font-bold text-black text-xl' onClick={handleLeaveRoom} >Leave</button>
        </div>
      </div>
      <div className='w-5/6 h-screen' >
        <Editor socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }} />
      </div>
    </div>
  )
}

export default EditorPage