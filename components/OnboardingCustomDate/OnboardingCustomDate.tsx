'use client'

import { useField } from 'formik'
import styles from './OnboardingCustomDate.module.css'

export default function OnboardingCustomDate() {
  const today = new Date().toISOString().split('T')[0]
  const [field, meta] = useField('dueDate')

  const hasError = meta.touched && meta.error

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        Очікувана дата пологів
      </label>

      <input
        type="date"
        min={today}
        {...field}
        className={`${styles.input} ${hasError ? styles.inputError : ''}`}
      />

      {hasError && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  )
}