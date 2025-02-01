import { useState } from 'react'


const App = () => {
  return (
    <div class="relative h-screen">
  <div class="absolute inset-0">
    <div class="relative h-full w-full bg-neutral-900 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-fuchsia-400 [&>div]:bg-[size:20px_20px] [&>div]:opacity-20 [&>div]:blur-[100px]">
    <div></div>
  </div>
  </div>
    </div>
  )
}

export default App

