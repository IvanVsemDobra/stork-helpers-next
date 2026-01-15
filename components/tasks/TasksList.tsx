"use client";

import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AddTaskModal from "../add-task-modal/AddTaskModal";

import styles from "./TasksList.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTasksStatus } from "@/services/tasks.service";

type TaskListProps = {
  isAuthenticated: boolean;
};

const TasksList = ({ isAuthenticated }: TaskListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const { data: tasks = [], isSuccess, isLoading, isPending } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: isAuthenticated,
    refetchOnMount: false,
  });

  const { mutate } = useMutation({
    mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
      updateTasksStatus(taskId, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleToggle = (task: Task) => {
    mutate({ taskId: task._id, isDone: !task.isDone });
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      router.push('/auth/register');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleTaskSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    handleCloseModal();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Важливі завдання</h3>
        <button className={styles.plusBtn} onClick={handleOpenModal}>+</button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Завантаження...</div>
      ) : !isAuthenticated ? (
        <div>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Створіть мерщій нове завдання!</p>
          <button className={styles.createBtn} onClick={() => router.push("/auth/register")}>
            Створити завдання
          </button>
        </div>
      ) : isSuccess && tasks.length === 0 ? (
        <div>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Створіть мерщій нове завдання!</p>
          <button className={styles.createBtn} onClick={handleOpenModal}>
            Створити завдання
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {tasks.map(task => (
            <li key={task._id} className={styles.item}>
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => handleToggle(task)}
                disabled={isPending}
              />
              <span className={task.isDone ? styles.done : ""}>
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTaskSaved={handleTaskSaved}
        />
      )}
    </div>
  );
};

export default TasksList;