import React, { useEffect } from "react";
import { type TaskPriority, type TaskStatus } from "../api/client";
import {
  sanitizePriority,
  sanitizeStatus,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../constants/tasks";

export type EditTaskForm = {
  title: string;
  description: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
};

type EditTaskModalProps = {
  isOpen: boolean;
  form: EditTaskForm;
  isSubmitting: boolean;
  onChange: (nextForm: EditTaskForm) => void;
  onClose: () => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export const EditTaskModal = ({
  isOpen,
  form,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: EditTaskModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="edit-task-title">Edit task</h2>

        <form className="modal-form" onSubmit={onSubmit}>
          <label htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            value={form.title}
            onChange={(event) =>
              onChange({
                ...form,
                title: event.target.value,
              })
            }
            maxLength={255}
            required
          />

          <label htmlFor="edit-description">Description</label>
          <input
            id="edit-description"
            value={form.description}
            onChange={(event) =>
              onChange({
                ...form,
                description: event.target.value,
              })
            }
          />

          <label htmlFor="edit-assignee">Assignee</label>
          <input
            id="edit-assignee"
            value={form.assignee}
            onChange={(event) =>
              onChange({
                ...form,
                assignee: event.target.value,
              })
            }
          />

          <label htmlFor="edit-status">Status</label>
          <select
            id="edit-status"
            value={form.status}
            onChange={(event) =>
              onChange({
                ...form,
                status: sanitizeStatus(event.target.value),
              })
            }
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          <label htmlFor="edit-priority">Priority</label>
          <select
            id="edit-priority"
            value={form.priority}
            onChange={(event) =>
              onChange({
                ...form,
                priority: sanitizePriority(event.target.value),
              })
            }
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
