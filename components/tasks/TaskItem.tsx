import { Task } from "@/types/task";

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: string, isDone: boolean) => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
    const handleChange = (): void => {
        onToggle(task._id, !task.isDone);
    };

    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={handleChange}
                />
                <span
                    style={{
                        textDecoration: task.isDone ? 'line-through' : 'none',
                    }}
                >
                    {task.name}
                </span>
            </label>
        </li>
    );
}