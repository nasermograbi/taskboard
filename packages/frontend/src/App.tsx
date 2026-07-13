import React, { useState, useCallback } from "react";
import { type Task, type TaskPriority } from "./api/client";
import { EditTaskModal, type EditTaskForm } from "./components/EditTaskModal";
import { TaskCard } from "./components/TaskCard";
import { TaskCreateForm } from "./components/TaskCreateForm";
import {
  sanitizePriority,
  sanitizeFilterStatus,
  STATUS_OPTIONS,
} from "./constants/tasks";
import { useTasks } from "./hooks/useTasks";

export const App = () => {
  const {
    tasks,
    filteredTasks,
    taskCounts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    filterStatus,
    setFilterStatus,
    handleLoadMore,
    createTask,
    updateTask,
    deleteTask,
    setError,
  } = useTasks();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(2);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState<EditTaskForm>({
    title: "",
    description: "",
    assignee: "",
    priority: 2,
    status: "OPEN",
  });

  const handleCreateTask = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createTask({
        title: trimmedTitle,
        description: description.trim() || null,
        assignee: assignee.trim() || null,
        priority,
      });
      setTitle("");
      setDescription("");
      setAssignee("");
      setPriority(2);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description ?? "",
      assignee: task.assignee ?? "",
      priority: sanitizePriority(task.priority),
      status: task.status,
    });
  }, []);

  const handleCloseEditModal = useCallback(() => {
    if (isEditSubmitting) return;
    setEditingTaskId(null);
  }, [isEditSubmitting]);

  const handleEditTask = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (editingTaskId === null) return;

    const trimmedTitle = editForm.title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    setIsEditSubmitting(true);
    setError(null);

    try {
      await updateTask(editingTaskId, {
        title: trimmedTitle,
        description: editForm.description.trim() || null,
        assignee: editForm.assignee.trim() || null,
        priority: editForm.priority,
        status: editForm.status,
      });
      setEditingTaskId(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update task";
      setError(message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="board">
        <h1>Tasks</h1>

        <TaskCreateForm
          title={title}
          description={description}
          assignee={assignee}
          priority={priority}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateTask}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onAssigneeChange={setAssignee}
          onPriorityChange={setPriority}
        />

        <div
          className="filters"
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <label htmlFor="status-filter">Filter by status: </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(sanitizeFilterStatus(e.target.value))
            }
          >
            <option value="ALL">All ({tasks.length})</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status} ({taskCounts[status]})
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="muted">Loading tasks...</p>}

        {error && !isLoading && <p className="error">{error}</p>}

        {!isLoading && !error && filteredTasks.length === 0 && (
          <p className="muted">No tasks found.</p>
        )}

        {!isLoading && !error && filteredTasks.length > 0 && (
          <>
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={async (id) => {
                    setError(null);
                    try {
                      await deleteTask(id);
                    } catch (err) {
                      const message =
                        err instanceof Error
                          ? err.message
                          : "Failed to delete task";
                      setError(message);
                    }
                  }}
                />
              ))}
            </ul>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="secondary"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More Tasks"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <EditTaskModal
        isOpen={editingTaskId !== null}
        form={editForm}
        isSubmitting={isEditSubmitting}
        onChange={setEditForm}
        onClose={handleCloseEditModal}
        onSubmit={handleEditTask}
      />
    </div>
  );
};
