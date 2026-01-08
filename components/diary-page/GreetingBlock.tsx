import React from 'react'
import { GreetingBlockProps } from '../../interfaces/diary'

export const GreetingBlock: React.FC<GreetingBlockProps> = () => {
  return (
    <div className="p-4 bg-purple-50 mb-4 rounded-lg">
      <h2 className="text-xl font-bold font-comfortaa">Доброго ранку, Ганна!</h2>
    </div>
  )
}
