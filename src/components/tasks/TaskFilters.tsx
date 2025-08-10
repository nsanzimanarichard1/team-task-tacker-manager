// Import React and shared UI components
import React, { useMemo } from "react"; // React for memoization and rendering
import { Button } from "@/components/ui/button"; // Button component for actions
import { Label } from "@/components/ui/label"; // Label component for accessibility
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Select UI primitives
import { useTasks } from "@/context/TaskContext"; // Global task state hook
import { Priority, Task } from "@/types/task"; // Typed domain models

// Define the shape of filter state that will be controlled here
interface TaskFiltersProps { // Props interface for TaskFilters
  categories: string[]; // List of category options derived from tasks
  users: string[]; // List of user options derived from tasks
} // End props interface

// Helper to build SelectItem list with an "All" option
function Options({ items }: { items: string[] }) { // Reusable options list component
  return ( // Render a fragment with options
    <> {/* Fragment for grouping */}
      <SelectItem value="all">All</SelectItem> {/* Universal All option */}
      {items.map((i) => ( // Map through provided items
        <SelectItem key={i} value={i}> {/* Use item as value */}
          {i} {/* Display item text */}
        </SelectItem> // End SelectItem
      ))} {/* End map */}
    </> // End fragment
  ); // End return
} // End Options component

// Main TaskFilters component rendering 5 combined filters
export const TaskFilters: React.FC<TaskFiltersProps> = ({ categories, users }) => { // Component declaration
  const { state, setFilters, clearFilters } = useTasks(); // Access filters and actions

  // Build memoized unique arrays to avoid recomputing on each render
  const categoryOptions = useMemo(() => Array.from(new Set(categories)).sort(), [categories]); // Unique categories sorted
  const userOptions = useMemo(() => Array.from(new Set(users)).sort(), [users]); // Unique users sorted

  return ( // Render filter controls
    <div className="grid gap-4 md:grid-cols-5"> {/* 5-column responsive grid */}
      <div className="space-y-1"> {/* Status filter wrapper */}
        <Label>Status</Label> {/* Accessible label */}
        <Select value={state.filters.status} onValueChange={(v) => setFilters({ status: v as typeof state.filters.status })}> {/* Status select */}
          <SelectTrigger>
            <SelectValue placeholder="All" /> {/* Placeholder label */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* All status */}
            <SelectItem value="completed">Completed</SelectItem> {/* Completed */}
            <SelectItem value="incomplete">Incomplete</SelectItem> {/* Incomplete */}
          </SelectContent>
        </Select> {/* End status select */}
      </div> {/* End Status */}

      <div className="space-y-1"> {/* Priority filter wrapper */}
        <Label>Priority</Label> {/* Label */}
        <Select value={state.filters.priority} onValueChange={(v) => setFilters({ priority: v as Priority | "all" })}> {/* Priority select */}
          <SelectTrigger>
            <SelectValue placeholder="All" /> {/* Placeholder */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* All option */}
            <SelectItem value="Low">Low</SelectItem> {/* Low */}
            <SelectItem value="Medium">Medium</SelectItem> {/* Medium */}
            <SelectItem value="High">High</SelectItem> {/* High */}
          </SelectContent>
        </Select> {/* End Priority */}
      </div> {/* End Priority wrapper */}

      <div className="space-y-1"> {/* Category filter wrapper */}
        <Label>Category</Label> {/* Label */}
        <Select value={state.filters.category} onValueChange={(v) => setFilters({ category: v as string | "all" })}> {/* Category select */}
          <SelectTrigger>
            <SelectValue placeholder="All" /> {/* Placeholder */}
          </SelectTrigger>
          <SelectContent>
            <Options items={categoryOptions} /> {/* Render options */}
          </SelectContent>
        </Select> {/* End Category */}
      </div> {/* End Category wrapper */}

      <div className="space-y-1"> {/* Due Date filter wrapper */}
        <Label>Due Date</Label> {/* Label */}
        <Select value={state.filters.dueDate} onValueChange={(v) => setFilters({ dueDate: v as typeof state.filters.dueDate })}> {/* Due date select */}
          <SelectTrigger>
            <SelectValue placeholder="All" /> {/* Placeholder */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* All */}
            <SelectItem value="overdue">Overdue</SelectItem> {/* Overdue */}
            <SelectItem value="today">Today</SelectItem> {/* Today */}
            <SelectItem value="upcoming">Upcoming</SelectItem> {/* Upcoming */}
            <SelectItem value="no-due-date">No Due Date</SelectItem> {/* No Due Date */}
          </SelectContent>
        </Select> {/* End Due Date */}
      </div> {/* End Due Date wrapper */}

      <div className="space-y-1"> {/* Assigned User filter wrapper */}
        <Label>Assigned User</Label> {/* Label */}
        <Select value={state.filters.assignedUser} onValueChange={(v) => setFilters({ assignedUser: v as string | "all" })}> {/* Assignee select */}
          <SelectTrigger>
            <SelectValue placeholder="All" /> {/* Placeholder */}
          </SelectTrigger>
          <SelectContent>
            <Options items={userOptions} /> {/* Render options */}
          </SelectContent>
        </Select> {/* End Assigned User */}
      </div> {/* End Assignee wrapper */}

      <div className="md:col-span-5 flex gap-3"> {/* Actions row spanning full width */}
        <Button variant="outline" onClick={() => clearFilters()}>Clear Filters</Button> {/* Clear filters */}
      </div> {/* End actions */}
    </div> // End filter grid
  ); // End return
}; // End TaskFilters component
