'use client'

import { Field, ErrorMessage } from 'formik'
import styles from './OnboardingCustomSelect.module.css'

export default function OnboardingCustomSelect() {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Стать дитини</label>
      <Field as="select" name="theme" className={styles.select}>
        <option value="neutral">Хлопчик</option>
        <option value="boy">Дівчинка</option>
        <option value="girl">Ще не знаю</option>
      </Field>
      <ErrorMessage name="theme" component="div" className={styles.error} />
    </div>
  )
}