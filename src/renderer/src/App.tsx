import { useState, useEffect, KeyboardEvent } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './assets/main.css'

type Item = { id: string; text: string }

const STORAGE_KEY = 'listItems'

function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    if (parsed.length > 0 && typeof parsed[0] === 'string') {
      return (parsed as string[]).map((text, i) => ({
        id: `legacy-${i}-${Date.now()}`,
        text,
      }))
    }
    return parsed as Item[]
  } catch {
    return []
  }
}

function SortableItem({
  item,
  onCopy,
  onDelete,
}: {
  item: Item
  onCopy: (text: string) => void
  onDelete: (id: string) => void
}): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`list-item ${isDragging ? 'list-item_dragging' : ''}`}
    >
      <span
        className="list-item-drag-handle"
        {...attributes}
        {...listeners}
        aria-label="拖拽排序"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </span>
      <span className="item-text">{item.text}</span>
      <div className="item-actions">
        <button onClick={() => onCopy(item.text)} className="icon-button">
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
        <button onClick={() => onDelete(item.id)} className="icon-button">
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
  )
}

function App(): React.JSX.Element {
  const [items, setItems] = useState<Item[]>(loadItems)
  const [inputValue, setInputValue] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastOpacity, setToastOpacity] = useState(1)

  useEffect(() => {
    setItems(loadItems())
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setItems([
        { id: crypto.randomUUID(), text: inputValue.trim() },
        ...items,
      ])
      setInputValue('')
    }
  }

  const handleCopy = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setToastVisible(true)
        setToastOpacity(1)
        setTimeout(() => {
          setToastOpacity(0)
        }, 1000)
        setTimeout(() => {
          setToastVisible(false)
          if (window.api && window.api.hideWindow) {
            window.api.hideWindow()
          }
        }, 1200)
      })
      .catch((err) => console.error('Failed to copy: ', err))
  }

  const handleDelete = (id: string): void => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (over == null || active.id === over.id) {
      return
    }
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      if (oldIndex === -1 || newIndex === -1) {
        return prev
      }
      return arrayMove(prev, oldIndex, newIndex)
    })
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onCopy={handleCopy}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
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
