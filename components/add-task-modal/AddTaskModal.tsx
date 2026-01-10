import { useEffect } from 'react'
import AddTaskForm from './AddTaskForm'
import styles from './AddTaskModal.module.css'
import { CloseOutlined } from '@ant-design/icons'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskToEdit?: {
    id: string
    title: string
    date: string
  } | null
}

const AddTaskModal = ({ isOpen, onClose, taskToEdit }: AddTaskModalProps) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', onEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.title}>{taskToEdit ? 'Редагувати завдання' : 'Нове завдання'}</h2>

        <AddTaskForm onClose={onClose} taskToEdit={taskToEdit} />
      </div>
    </div>
  )
}

export default AddTaskModal
