"use client";

import { getTasks, updateTaskStatus } from "@/services/tasks.service";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskModal from "../add-task-modal/AddTaskModal";

import styles from "./TasksList.module.css";


interface TasksListProps {
  isAuthenticated: boolean;
}

export default function TasksList({ isAuthenticated }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();


  useEffect(() => {
    if (!isAuthenticated) return;
   
    const fetchTasks = async() => {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Помилка завантаження завдань:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated]);
  
  const handleAddAction = (): void => {
    if (!isAuthenticated) {
      router.push('/auth/register');
      return;
    }
    setIsModalOpen(true);
  };

  const handleToggle = async (
    taskId: string,
    isDone: boolean
  ): Promise<void> => {
    try {
      const updatedTask = await updateTaskStatus(taskId, isDone);

      setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task )
      );
    } catch (error) {
      console.error('Помилка оновлення статусу', error);
    }
  };

  const handleCloseModal = async (): Promise<void> => {
    setIsModalOpen(false);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Помилка оновлення списку', error);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Важливі завдання</h2>

        <button
          className={styles.plusButton}
          onClick={handleAddAction}
          aria-label="Додати завдання"
        >
          +
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Завантаження...</div>
      ) : tasks.length === 0 ? (
        <div className={styles.placeholder}>
          <p className={styles.emptyTextBold}>
            Наразі немає жодних завдань
          </p>
          <p className={styles.emptyText}>
            Створіть мерщій нове завдання!
          </p>
          <button
            className={styles.createButton}
            onClick={handleAddAction}
          >
            Створити завдання
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      )}

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          />
      )}
    </section>
  );
}

  
  // const handleTaskAdded = async (): Promise<void> => {
  //   try {
  //     const updatedTasks = await getTasks();
  //     setTasks(updatedTasks);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
//     getTasks()
//       .then(setTasks)
//       .catch(console.error);
//   }, [isAuthenticated]);


//   const handleAddTaskClick = (): void => {
//     if (!isAuthenticated) {
//       router.push("/auth/register");
//       return;
//     }
//     setIsModalOpen(true);
//   };

//   const handleToggleTask = async (
//     taskId: string,
//     isDone: boolean
//   ): Promise<void> => {
//     try {
//       const updatedTask = await updateTaskStatus(taskId, isDone);

//       setTasks(prev =>
//         prev.map(task =>
//           task._id === updatedTask._id ? updatedTask : task
//         )
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

  


//   return (
//     <section className={styles.tasks}>
//       <h3 className={styles.title}>Важливі завдання</h3>

//       {tasks.length === 0 ? (
//         <TasksPlaceholder onAdd={handleAddTaskClick} />
//       ) : (
//         <ul className={styles.list}>
//           {tasks.map(task => (
//             <TaskItem
//               key={task._id}
//               task={task}
//               onToggle={handleToggleTask}
//             />
//           ))}
//         </ul>
//       )}

//       {isModalOpen && (
//         <AddTaskModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onTaskAdded={handleTaskAdded}
//         />
//       )}
//     </section>
//   );
// }
