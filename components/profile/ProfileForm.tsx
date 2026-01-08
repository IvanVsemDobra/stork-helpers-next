'use client'

import React, { useState } from 'react'
import './ProfileForm.module.css'

interface ProfileFormValues {
  name: string
  email: string
}

interface ProfileFormProps {
  initialValues?: ProfileFormValues
  onSubmit?: (values: ProfileFormValues) => void
  isLoading?: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [values, setValues] = useState<ProfileFormValues>({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(values)
  }

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <h2 className="title">Профіль</h2>
      <div className="fieldGroup">
        <label className="label">Імʼя</label>
        <input
          className="input"
          name="name"
          value={values.name}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="fieldGroup">
        <label className="label">Email</label>
        <input
          className="input"
          name="email"
          value={values.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="buttonGroup">
        <button className="saveButton" type="submit" disabled={isLoading}>
          Зберегти
        </button>
        <button className="cancelButton" type="button" disabled={isLoading}>
          Відмінити
        </button>
      </div>
    </form>
  )
}
