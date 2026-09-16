import React from 'react'
import loadingIcon from '@/assets/images/loading.svg'

const Loading = () => {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center bg-[#FFF9F2]/80'>
      <img src={loadingIcon} width={80} className="sm:w-[100px] w-[70px]" />
    </div>
  )
}

export default Loading