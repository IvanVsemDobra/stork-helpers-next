"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import type { Task } from "@/types/task";

import AddTaskModal from "../add-task-modal/AddTaskModal";
import styles from "./TasksReminderCard.module.css";
import { getTasks, updateTasksStatus } from "@/services/tasks.service";

interface TasksListProps {
  isAuthenticated: boolean;
};

const TasksList = ({ isAuthenticated }: TasksListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: isAuthenticated,
  });


  const { mutate: toggleTask } = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      updateTasksStatus(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggle = (task: Task) => {
    toggleTask({ id: task._id, isDone: !task.isDone });
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleTaskSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    handleCloseModal();
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Важливі завдання</h3>
        <button className={styles.plusBtn} onClick={handleOpenModal}>+</button>
      </div>

      {/*  NOT AUTHENTICATED */}
      {!isAuthenticated && (
        <>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Створіть мерщій нове завдання!</p>
          <button
            className={styles.createBtn}
            onClick={() => router.push("/auth/register")}
          >
            Створити завдання
          </button>
        </>
      )}

      {/* NO TASKS*/}
      {isAuthenticated && tasks.length === 0 && (
        <>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Створіть мерщій нове завдання!</p>
          <button className={styles.createBtn} onClick={handleOpenModal}>
            Створити завдання
          </button>
        </>
      )}

      {/* OK */}
      {isAuthenticated && tasks.length > 0 && (
        <ul className={styles.list}>
          {tasks.map(task => (
            <li key={task._id} className={styles.item}>
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => handleToggle(task)}
              />
              <span className={task.isDone ? styles.done : ""}>
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      )}

   
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskSaved={handleTaskSaved}
      />
    </section>
  );
};

export default TasksList;
