import React, { useState } from 'react'
import {v4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId,setRoomId] = useState('');
  const [userName,setUserName] = useState('');
  const navigate = useNavigate();


  const createNewRoom = (e) => {
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success('Room created');
  }

  const JoinRoom = (e) =>{
    if(!roomId || !userName){
      toast.error('Fill those fields homie');
      return;
    }

    navigate(`/editor/${roomId}`, {
      state:{
        roomId,
        userName,
      }
    });
  }

  return (
    <div className='bg-slate-950 min-h-screen flex items-center justify-center' >
      <div className='w-1/3 border border-[#A41445] p-10 rounded-2xl flex flex-col space-y-5 '  >
        <div className='flex items-center gap-4' >
          <img className='w-[70px] h-[70px] rounded-full' src="/logo.jpeg" alt="logoImg" />
          <h3 className='font-bold text-5xl text-white' >Code Rooms</h3>
        </div>
        <h4 className='text-[#A41445] font-semibold text-2xl' >Enter Room Id</h4>

        <div className='flex flex-col space-y-4' >
          <input className='rounded-md p-2 font-bold'  type="text" placeholder='roomId' value={roomId} onChange={(e)=> setRoomId(e.target.value)}/>
          <input className='rounded-md p-2 font-bold '  type="text" placeholder='userName' value={userName} onChange={(e) => setUserName(e.target.value)} />
          <button onClick={JoinRoom} className='bg-[#A41445] w-1/3 p-2 rounded-xl font-semibold text-white' >Join Room</button>
          <span className='text-white' >Don't have an invite ? &nbsp;<span onClick={createNewRoom} className='text-[#A41445] underline underline-offset-2 cursor-pointer' >Create your private Code Room</span></span>
        </div>

      </div>
    </div>
  )
}

export default Home