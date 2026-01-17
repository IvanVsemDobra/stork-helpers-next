"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import styles from "./AddTaskForm.module.css";

interface AddTaskFormProps {
  /* onClose: () => void; */
  onTaskSaved: () => void;
  taskToEdit?: {
    id: string;
    name: string;
    date: string;
  } | null;
}

type TaskFormValues = {
  name: string;
  date: string;
};

const taskValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Назва завдання повинна містити мінімум 3 символи")
    .max(100, "Назва завдання не може перевищувати 100 символів")
    .required("Обов'язкове поле"),
  date: Yup.date()
    .required("Обов'язкове поле")
    .typeError("Введіть коректну дату"),
});

const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const AddTaskForm = ({ /* onClose, */ onTaskSaved,taskToEdit }: AddTaskFormProps) => {
  const initialValues: TaskFormValues = {
    name: taskToEdit?.name || "",
    date: taskToEdit?.date || getCurrentDate(),
  };

  const handleSubmit = async (
  values: TaskFormValues,
  { setSubmitting }: FormikHelpers<TaskFormValues>
) => {
  try {
    const url = taskToEdit ? `/api/tasks/${taskToEdit.id}` : "/api/tasks";
    const method = taskToEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    toast.success(
      taskToEdit ? "Завдання оновлено!" : "Завдання створено!"
    );

    onTaskSaved(); 

  } catch {
    toast.error("Помилка при збереженні завдання");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={taskValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Завдання <span className={styles.required}>*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Введіть назву завдання"
              className={`${styles.input} ${
                errors.name && touched.name ? styles.error : ""
              }`}
            />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="date" className={styles.label}>
              Дата <span className={styles.required}>*</span>
            </label>
            <Field
              id="date"
              name="date"
              type="date"
              className={`${styles.input} ${
                errors.date && touched.date ? styles.error : ""
              }`}
            />
            <ErrorMessage
              name="date"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.button} ${styles.submitButton}`}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddTaskForm;
