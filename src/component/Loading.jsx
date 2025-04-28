import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center pt-40 pb-40">
        <div>
          <span className="loading loading-spinner loading-xs"></span>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-spinner loading-md"></span>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
  )
}

export default Loading