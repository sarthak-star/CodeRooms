import React from 'react'
import Avatar from 'react-avatar'

const Client = ({userName}) => {
  return (
    <div className='space-x-4' >
        <Avatar name={userName} size={35} round='20px' />
        <span className='text-white font-semibold text-xl' >{userName}</span>
    </div>
  )
}

export default Client