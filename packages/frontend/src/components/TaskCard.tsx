import { memo } from "react";
import { type Task } from "../api/client";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void | Promise<void>;
};

export const TaskCard = memo(({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <li className="task-card">
      <div className="task-head">
        <h2>{task.title}</h2>
        <span className={`status status-${task.status.toLowerCase()}`}>
          {task.status}
        </span>
      </div>
      {task.description && <p>{task.description}</p>}
      <p className="meta">
        Assignee: {task.assignee ?? "Unassigned"} | Priority:{" "}
        {task.priority ?? "-"}
      </p>
      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => void onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
});
