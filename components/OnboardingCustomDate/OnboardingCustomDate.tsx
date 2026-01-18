'use client'

import { useField } from 'formik'
import styles from './OnboardingCustomDate.module.css'

interface OnboardingCustomDateProps {
  className?: string
}

export default function OnboardingCustomDate({ className }: OnboardingCustomDateProps) {
  const [field, meta] = useField('dueDate')
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Очікувана дата пологів</label>

      <input
        type="date"
        {...field}
        className={`${styles.input} ${meta.touched && meta.error ? styles.invalidInput : ''} ${className || ''}`}
        min={today}
        required
      />

      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  )
}