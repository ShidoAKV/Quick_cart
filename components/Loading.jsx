import React from 'react'
const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="animate-spin rounded-full h-15 w-15 border-3 border-t-gray-800 border-gray-200"></div>
        </div>
    )
}

export default Loading