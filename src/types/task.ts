// Defines core Task domain types used across the app
// Export a union type for task priority levels
export type Priority = "Low" | "Medium" | "High"; // Allowed priority values

// Export a union type for status filter options
export type StatusFilter = "all" | "completed" | "incomplete"; // Status filter options

// Export a union type for due date filter options
export type DueDateFilter = "all" | "overdue" | "today" | "upcoming" | "no-due-date"; // Due date filter categories

// Define the Task interface representing a single task entity
export interface Task { // Interface for a task record
  id: string; // Unique identifier for the task
  taskName: string; // Task title or name
  priority: Priority; // Task priority value
  category: string; // Category label such as Frontend, Backend, etc.
  dueDate: Date | null; // Optional due date (null when not set)
  assignedUser: string; // Name of the assignee
  assignedOn: Date; // Date when the task was assigned
  completed: boolean; // Whether the task is completed
}

// Filters object defining all filterable fields simultaneously
export interface TaskFilters { // Interface for filter selections
  status: StatusFilter; // Status selection
  priority: Priority | "all"; // Priority selection or all
  category: string | "all"; // Category selection or all
  dueDate: DueDateFilter; // Due date selection
  assignedUser: string | "all"; // Assignee selection or all
}
