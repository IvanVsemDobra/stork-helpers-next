'use client'

import React, { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import styles from './add-diary-entry-modal.module.scss'
import AddDiaryEntryForm from './AddDiaryEntryForm'
import { DiaryEntry } from '@/interfaces/diary'

interface AddDiaryEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  isEdit?: boolean
  initialData?: DiaryEntry | null
}

export const AddDiaryEntryModal: React.FC<AddDiaryEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  isEdit = false,
  initialData = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрити">
          <CloseOutlined />
        </button>

        <h2 className={styles.title}>{isEdit ? 'Редагувати запис' : 'Новий запис'}</h2>

        <AddDiaryEntryForm
          isEdit={isEdit}
          initialData={initialData}
          onSubmitSuccess={onSubmitSuccess}
          onClose={onClose}
        />
      </div>
    </div>
  )
}
