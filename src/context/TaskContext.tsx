// React and utilities imports
import React, { createContext, useContext, useMemo, useReducer } from "react"; // Import React APIs for context and reducer
import { // Import date helpers from date-fns v3
  endOfDay, // End of current day utility
  isAfter, // Check if date A is after date B
  isBefore, // Check if date A is before date B
  isSameDay, // Check if two dates occur on the same day
  startOfDay, // Start of current day utility
} from "date-fns"; // date-fns library
import { // Import typed Task and filter types
  Task, // Task interface
  TaskFilters, // Filters interface
} from "@/types/task"; // Local types module

// Define action types as a string union for reducer discrimination
type Action = // Reducer action variants
  | { type: "ADD_TASK"; payload: Task } // Add a new task
  | { type: "UPDATE_TASK"; payload: Task } // Update an existing task
  | { type: "DELETE_TASK"; payload: { id: string } } // Delete a task by id
  | { type: "TOGGLE_TASK"; payload: { id: string } } // Toggle completion status
  | { type: "SET_FILTERS"; payload: Partial<TaskFilters> } // Partially update filters
  | { type: "CLEAR_FILTERS" }; // Reset all filters to defaults

// Define the shape of the global task state
interface TaskState { // State interface used by reducer
  tasks: Task[]; // Array of all tasks
  filters: TaskFilters; // Current active filters
}

// Provide an initial set of tasks for a non-empty starting UI
const seedTasks: Task[] = [ // Demo tasks to showcase the UI initially
  { // First task object
    id: crypto.randomUUID(), // Generate unique id using Web Crypto API
    taskName: "Design login screen", // Task title
    priority: "High", // Priority value
    category: "Frontend", // Category label
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
    assignedUser: "Alice", // Assignee name
    assignedOn: new Date(), // Assigned today
    completed: false, // Not completed yet
  }, // End first task
  { // Second task object
    id: crypto.randomUUID(), // Unique id
    taskName: "API auth endpoints", // Task title
    priority: "Medium", // Priority value
    category: "Backend", // Category label
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Due yesterday (overdue)
    assignedUser: "Bob", // Assignee name
    assignedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Assigned 3 days ago
    completed: false, // Not completed
  }, // End second task
  { // Third task object
    id: crypto.randomUUID(), // Unique id
    taskName: "Sprint planning", // Task title
    priority: "Low", // Priority value
    category: "Meeting", // Category label
    dueDate: null, // No due date
    assignedUser: "Carol", // Assignee name
    assignedOn: new Date(), // Assigned today
    completed: true, // Completed
  }, // End third task
]; // End seed task array

// Define default filter values used to initialize and to clear
const defaultFilters: TaskFilters = { // Default filters state
  status: "all", // Show all statuses
  priority: "all", // Show all priorities
  category: "all", // Show all categories
  dueDate: "all", // Show all due date ranges
  assignedUser: "all", // Show all assignees
}; // End default filters

// Combine initial tasks and filters into initial state
const initialState: TaskState = { // Initial reducer state
  tasks: seedTasks, // Seed with demo tasks
  filters: defaultFilters, // Start with default filters
}; // End initial state

// Helper to apply complex multi-field filtering
function applyFilters(tasks: Task[], filters: TaskFilters): Task[] { // Filter function
  const now = new Date(); // Current date-time
  const todayStart = startOfDay(now); // Midnight today
  const todayEnd = endOfDay(now); // End of today

  // Return tasks filtered by each criterion
  return tasks.filter((t) => { // Iterate through tasks
    // Status filtering: completed/incomplete/all
    if (filters.status === "completed" && !t.completed) return false; // Hide not completed when completed selected
    if (filters.status === "incomplete" && t.completed) return false; // Hide completed when incomplete selected

    // Priority filtering: specific priority or all
    if (filters.priority !== "all" && t.priority !== filters.priority) return false; // Exclude different priority

    // Category filtering: match string or all
    if (filters.category !== "all" && t.category !== filters.category) return false; // Exclude different category

    // Assigned user filtering: match string or all
    if (filters.assignedUser !== "all" && t.assignedUser !== filters.assignedUser) return false; // Exclude different user

    // Due date filtering with 5 categories
    if (filters.dueDate !== "all") { // Only evaluate when not showing all
      if (filters.dueDate === "no-due-date") { // No due date category
        if (t.dueDate !== null) return false; // Exclude tasks that have a due date
      } else if (t.dueDate == null) { // For other categories we require a due date
        return false; // Exclude tasks without due date
      } else if (filters.dueDate === "today") { // Today category
        if (!isSameDay(t.dueDate, now)) return false; // Keep only tasks due today
      } else if (filters.dueDate === "overdue") { // Overdue category
        if (!isBefore(t.dueDate, todayStart)) return false; // Keep due strictly before today
      } else if (filters.dueDate === "upcoming") { // Upcoming category
        if (!isAfter(t.dueDate, todayEnd)) return false; // Keep due strictly after today
      } // End due date categories
    } // End due date filtering

    return true; // Keep task when all checks passed
  }); // End filter callback
} // End applyFilters

// Create the reducer handling immutable state transitions
function reducer(state: TaskState, action: Action): TaskState { // Reducer function
  switch (action.type) { // Switch by action type
    case "ADD_TASK": { // Add task branch
      return { ...state, tasks: [action.payload, ...state.tasks] }; // Prepend new task
    } // End add branch
    case "UPDATE_TASK": { // Update task branch
      return { // Return new state
        ...state, // Preserve other fields
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)), // Replace matching task
      }; // End return
    } // End update branch
    case "DELETE_TASK": { // Delete task branch
      return { // Return new state
        ...state, // Preserve other fields
        tasks: state.tasks.filter((t) => t.id !== action.payload.id), // Remove by id
      }; // End return
    } // End delete branch
    case "TOGGLE_TASK": { // Toggle completion branch
      return { // Return new state
        ...state, // Preserve other fields
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, completed: !t.completed } : t)), // Flip completed
      }; // End return
    } // End toggle branch
    case "SET_FILTERS": { // Set filters branch
      return { // Return new state
        ...state, // Preserve other fields
        filters: { ...state.filters, ...action.payload }, // Merge partial filters
      }; // End return
    } // End set filters branch
    case "CLEAR_FILTERS": { // Clear filters branch
      return { // Return new state
        ...state, // Preserve other fields
        filters: defaultFilters, // Reset to defaults
      }; // End return
    } // End clear filters branch
    default: { // Default case
      return state; // No changes
    } // End default
  } // End switch
} // End reducer

// Define the context value interface combining state, derived data, and actions
interface TaskContextValue { // Context value interface
  state: TaskState; // Raw state for advanced usage
  filteredTasks: Task[]; // Derived list after applying filters
  addTask: (task: Task) => void; // Add task function
  updateTask: (task: Task) => void; // Update task function
  deleteTask: (id: string) => void; // Delete task function
  toggleTask: (id: string) => void; // Toggle completion function
  setFilters: (partial: Partial<TaskFilters>) => void; // Update filters function
  clearFilters: () => void; // Reset filters function
}

// Create the actual React context with a default undefined value
const TaskContext = createContext<TaskContextValue | undefined>(undefined); // Context for tasks

// Export the provider to wrap parts of the app needing task state
export const TaskProvider: React.FC<React.PropsWithChildren> = ({ children }) => { // TaskProvider component
  const [state, dispatch] = useReducer(reducer, initialState); // Initialize reducer with initial state

  const filteredTasks = useMemo(() => applyFilters(state.tasks, state.filters), [state.tasks, state.filters]); // Memoize filtered tasks

  const value: TaskContextValue = useMemo( // Memoize context value to avoid needless renders
    () => ({ // Create context object
      state, // Expose state
      filteredTasks, // Expose derived tasks
      addTask: (task) => dispatch({ type: "ADD_TASK", payload: task }), // Add dispatcher
      updateTask: (task) => dispatch({ type: "UPDATE_TASK", payload: task }), // Update dispatcher
      deleteTask: (id) => dispatch({ type: "DELETE_TASK", payload: { id } }), // Delete dispatcher
      toggleTask: (id) => dispatch({ type: "TOGGLE_TASK", payload: { id } }), // Toggle dispatcher
      setFilters: (partial) => dispatch({ type: "SET_FILTERS", payload: partial }), // Filters dispatcher
      clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }), // Clear filters dispatcher
    }), // End object
    [state, filteredTasks] // Recompute when state or derived list changes
  ); // End useMemo

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>; // Provide context to subtree
}; // End TaskProvider

// Export a typed hook to consume the task context safely
export function useTasks(): TaskContextValue { // useTasks custom hook
  const ctx = useContext(TaskContext); // Read context
  if (!ctx) { // If missing provider
    throw new Error("useTasks must be used within a TaskProvider"); // Throw helpful error
  } // End guard
  return ctx; // Return the context value
} // End useTasks
