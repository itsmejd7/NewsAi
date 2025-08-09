import React, { useState } from 'react'

const topics = ['tech', 'sports', 'finance', 'health', 'entertainment']

function TopicSelector({ onChange }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (topic) => {
    const newSelection = selected === topic ? null : topic
    setSelected(newSelection)
    onChange(newSelection ? [newSelection] : [])
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => handleSelect(topic)}
          className={`px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ease-in-out border shadow-sm hover:scale-105
            ${
              selected === topic
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
        >
          {topic.charAt(0).toUpperCase() + topic.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default TopicSelector
