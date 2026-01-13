import { getTasks, updateTasksStatus } from "@/services/tasks.service";
import { Task } from "@/types/task";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskModal from "../add-task-modal/AddTaskModal";
import TasksPlaceholder from "./TasksPlaceholder";

interface TasksListProps {
    isAuthenticated: boolean;
}

export default function TasksList({ isAuthenticated }: TasksListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) return;

        getTasks().then(setTasks).catch(console.error);
    }, [isAuthenticated]);

    const handleAddTaskClick = (): void => {
        if (!isAuthenticated) {
            router.push('/auth/register');
            return;
        }
        setIsModalOpen(true);
    }

    const handleToggleTask = async (
        taskId: string,
        isDone: boolean
    ): Promise<void> => {
        try {
            const updatedTask = await updateTasksStatus(taskId, isDone);

            setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
        } catch (error) { console.error(error); }
    };

    return (
        <section>
            <button onClick={handleAddTaskClick}>
                Add task
            </button>

            {tasks.length === 0 ? (
                <TasksPlaceholder />
            ) : (
                <ul>
                    {tasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onToggle={handleToggleTask}
                        />
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </section>
    )
}