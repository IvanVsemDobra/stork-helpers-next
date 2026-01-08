import React from 'react'
import { DiaryEntryDetailsProps } from '../../interfaces/diary'

export const DiaryEntryDetails: React.FC<DiaryEntryDetailsProps> = ({ entry }) => {
  if (!entry) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg p-6">
        <p className="text-center font-lato text-lg">Наразі записи у щоденнику відсутні</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-comfortaa">{entry.title}</h2>
          <p className="text-gray-500 text-sm font-lato">{entry.date}</p>
        </div>
        <div className="flex gap-2">
          <button className="text-blue-500 text-sm">Редагувати</button>
          <button className="text-red-500 text-sm">Видалити</button>
        </div>
      </div>

      <div className="mb-4">
        {/* Тут будуть іконки емоцій */}
        <span className="text-sm text-gray-500">[Список емоцій]</span>
      </div>

      <div className="prose max-w-none font-lato">{entry.content}</div>
    </div>
  )
}
