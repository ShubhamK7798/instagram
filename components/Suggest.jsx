import Image from 'next/image'
import React from 'react'

const Suggest = ({name,img,button}) => {
  return (
    <div className='flex justify-between items-center mt-8  -ml-12 mr-12'>


        <div className='flex space-x-4 items-center'>
            {img &&       <div className='relative w-10 rounded-full overflow-hidden h-10 cursor-pointer'>

<Image src={img} layout='fill' objectFit='cover'/>
    </div>}
      
            <h1 className='cursor-pointer hover:underline'>{name}</h1>
        </div>
        
        <div>
            <p className='text-blue-600 italic cursor-pointer'>{button}</p>
        </div>



    </div>
  )
}

export default Suggest