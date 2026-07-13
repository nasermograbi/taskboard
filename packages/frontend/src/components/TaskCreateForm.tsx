import React from "react";
import { type TaskPriority } from "../api/client";
import { sanitizePriority, PRIORITY_OPTIONS } from "../constants/tasks";

type TaskCreateFormProps = {
  title: string;
  description: string;
  assignee: string;
  priority: TaskPriority;
  isSubmitting: boolean;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
};

export const TaskCreateForm = ({
  title,
  description,
  assignee,
  priority,
  isSubmitting,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
  onAssigneeChange,
  onPriorityChange,
}: TaskCreateFormProps) => {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="Task title"
        maxLength={255}
        required
      />
      <input
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Description (optional)"
      />
      <input
        value={assignee}
        onChange={(event) => onAssigneeChange(event.target.value)}
        placeholder="Assignee (optional)"
      />
      <select
        value={priority}
        onChange={(event) =>
          onPriorityChange(sanitizePriority(event.target.value))
        }
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
};
