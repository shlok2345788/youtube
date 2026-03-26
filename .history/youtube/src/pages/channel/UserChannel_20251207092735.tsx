import ChannelHeader from '@/components/ChannelHeader'
import React from 'react'
import {user} from '../DataContent/Data'

const UserChannel = () => {

    
  return (
    <div><ChannelHeader channel={channel} user={user} /></div>
  )
}

export default UserChannel