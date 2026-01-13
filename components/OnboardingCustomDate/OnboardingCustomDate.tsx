'use client'

import { Field, ErrorMessage } from 'formik'
import styles from './OnboardingCustomDate.module.css'

export default function OnboardingCustomDate() {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Очікувана дата пологів</label>
      <Field type="date" name="dueDate" className={styles.input} />
      <ErrorMessage name="dueDate" component="div" className={styles.error} />
    </div>
  )
}