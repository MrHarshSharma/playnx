import React from 'react'

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="max-w-screen-xl w-full flex-1">{children}</div>
    </div>
  )
}

export default Layout