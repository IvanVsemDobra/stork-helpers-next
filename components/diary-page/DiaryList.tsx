import React from 'react'
import { DiaryListProps } from '../../interfaces/diary'

// Додаємо " = []" після entries.
// Тепер, якщо entries буде undefined, React використає порожній масив.
export const DiaryList: React.FC<DiaryListProps> = ({ entries = [] }) => {
  return (
    <div className="diary-list-container">
      <div className="flex justify-between items-center mb-4 p-4">
        <h3 className="text-2xl font-bold font-comfortaa">Ваші записи</h3>
        <button className="text-blue-500 font-lato hover:underline">+ Новий запис</button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {/* Тепер тут безпечно, бо entries завжди буде масивом */}
        {entries.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Список записів порожній</p>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition"
            >
              <h3 className="font-bold">{entry.title}</h3>
              <span className="text-sm text-gray-500">{entry.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
