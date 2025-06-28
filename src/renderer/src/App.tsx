import { useState, useEffect, KeyboardEvent } from 'react'
import './assets/main.css'

function App(): React.JSX.Element {
  const [items, setItems] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastOpacity, setToastOpacity] = useState(1)

  useEffect(() => {
    const storedItems = localStorage.getItem('listItems')
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('listItems', JSON.stringify(items))
  }, [items])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setItems([inputValue.trim(), ...items])
      setInputValue('')
    }
  }

  const handleCopy = (item: string): void => {
    navigator.clipboard
      .writeText(item)
      .then(() => {
        setToastVisible(true)
        setToastOpacity(1)
        setTimeout(() => {
          setToastOpacity(0)
        }, 1000)
        setTimeout(() => {
          setToastVisible(false)
        }, 1200)
      })
      .catch((err) => console.error('Failed to copy: ', err))
  }

  const handleDelete = (index: number): void => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Add a new item..."
      />
      <div className="list-container">
        {items.map((item, index) => (
          <div key={index} className="list-item">
            <span className="item-text">{item}</span>
            <div className="item-actions">
              <button onClick={() => handleCopy(item)} className="icon-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
              <button onClick={() => handleDelete(index)} className="icon-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {toastVisible && (
        <div className="toast" style={{ opacity: toastOpacity }}>
          复制成功
        </div>
      )}
    </div>
  )
}

export default App
