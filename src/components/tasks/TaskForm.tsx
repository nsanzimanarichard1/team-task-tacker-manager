// Import React and state utilities
import React, { useEffect, useMemo, useState } from "react"; // React APIs for state and memoization
import { Button } from "@/components/ui/button"; // Reusable Button component
import { Input } from "@/components/ui/input"; // Reusable Input component
import { Label } from "@/components/ui/label"; // Reusable Label component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Reusable Select components
import { useTasks } from "@/context/TaskContext"; // Global task context hook
import { Task } from "@/types/task"; // Task type for props

// Define the component props for editing an existing task optionally
interface TaskFormProps { // Props interface for TaskForm
  editingTask?: Task | null; // Optional task to edit; null/undefined means adding new
  onSaved?: () => void; // Optional callback when saved (add or update)
} // End props interface

// Helper to format a Date into yyyy-MM-dd for input[type=date]
function formatDateInput(d: Date | null): string { // Convert Date to string for input
  if (!d) return ""; // Empty string for null
  const yyyy = d.getFullYear(); // Extract year
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // Extract month, pad
  const dd = String(d.getDate()).padStart(2, "0"); // Extract day, pad
  return `${yyyy}-${mm}-${dd}`; // Combine into ISO date format
} // End helper

// Main TaskForm component supports both add and edit modes
export const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onSaved }) => { // Component declaration
  const { addTask, updateTask } = useTasks(); // Extract context actions

  // Local form state initialized from editingTask when present
  const [taskName, setTaskName] = useState<string>(editingTask?.taskName ?? ""); // Task name field
  const [priority, setPriority] = useState<Task["priority"]>(editingTask?.priority ?? "Medium"); // Priority field
  const [category, setCategory] = useState<string>(editingTask?.category ?? ""); // Category field
  const [dueDate, setDueDate] = useState<Date | null>(editingTask?.dueDate ?? null); // Due date field
  const [assignedUser, setAssignedUser] = useState<string>(editingTask?.assignedUser ?? ""); // Assignee field
  const [assignedOn, setAssignedOn] = useState<Date>(editingTask?.assignedOn ?? new Date()); // Assigned on field

  // Update local state when editingTask changes (e.g., switching edits)
  useEffect(() => { // Effect to sync incoming editingTask
    if (!editingTask) return; // Ignore when adding new
    setTaskName(editingTask.taskName); // Sync task name
    setPriority(editingTask.priority); // Sync priority
    setCategory(editingTask.category); // Sync category
    setDueDate(editingTask.dueDate); // Sync due date
    setAssignedUser(editingTask.assignedUser); // Sync assignee
    setAssignedOn(editingTask.assignedOn); // Sync assigned on
  }, [editingTask]); // Re-run when editingTask changes

  // Compute whether the form is valid to enable the submit button
  const isValid = useMemo(() => { // Memoize validity check
    return taskName.trim().length > 0 && assignedUser.trim().length > 0 && category.trim().length > 0; // Basic required fields
  }, [taskName, assignedUser, category]); // Dependencies for validity

  // Submit handler to add or update a task
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => { // Form submit handler
    e.preventDefault(); // Prevent full page reload

    const base: Task = { // Build task object from form fields
      id: editingTask?.id ?? crypto.randomUUID(), // Reuse id for edits or generate new id
      taskName: taskName.trim(), // Trimmed task name
      priority, // Selected priority
      category: category.trim(), // Trimmed category
      dueDate, // Due date as Date or null
      assignedUser: assignedUser.trim(), // Trimmed assignee
      assignedOn, // Assigned on date
      completed: editingTask?.completed ?? false, // Preserve completed state for edits
    }; // End base task

    if (editingTask) { // If editing
      updateTask(base); // Dispatch update
    } else { // Otherwise adding new
      addTask(base); // Dispatch add
    } // End add/edit

    onSaved?.(); // Notify parent if provided

    if (!editingTask) { // Reset only when adding new
      setTaskName(""); // Clear task name
      setPriority("Medium"); // Reset priority
      setCategory(""); // Clear category
      setDueDate(null); // Clear due date
      setAssignedUser(""); // Clear assignee
      setAssignedOn(new Date()); // Reset assigned on to today
    } // End reset
  }; // End submit handler

  return ( // Render form JSX
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" aria-label="Task form"> {/* Root form grid */}
      <div className="space-y-1"> {/* Task Name field wrapper */}
        <Label htmlFor="taskName">Task Name</Label> {/* Accessible label */}
        <Input id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g., Implement auth" /> {/* Text input */}
      </div> {/* End Task Name */}

      <div className="space-y-1"> {/* Priority field wrapper */}
        <Label>Priority</Label> {/* Label without for due to composite input */}
        <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}> {/* Priority select */}
          <SelectTrigger>
            <SelectValue placeholder="Choose priority" /> {/* Placeholder */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem> {/* Low option */}
            <SelectItem value="Medium">Medium</SelectItem> {/* Medium option */}
            <SelectItem value="High">High</SelectItem> {/* High option */}
          </SelectContent>
        </Select> {/* End Priority */}
      </div> {/* End Priority wrapper */}

      <div className="space-y-1"> {/* Category field wrapper */}
        <Label htmlFor="category">Category</Label> {/* Category label */}
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Frontend" /> {/* Category input */}
      </div> {/* End Category */}

      <div className="space-y-1"> {/* Assigned User field wrapper */}
        <Label htmlFor="assignedUser">Assigned User</Label> {/* Assignee label */}
        <Input id="assignedUser" value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} placeholder="e.g., Alice" /> {/* Assignee input */}
      </div> {/* End Assignee */}

      <div className="space-y-1"> {/* Due Date field wrapper */}
        <Label htmlFor="dueDate">Due Date</Label> {/* Due date label */}
        <Input id="dueDate" type="date" value={formatDateInput(dueDate)} onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)} /> {/* Date input */}
      </div> {/* End Due Date */}

      <div className="space-y-1"> {/* Assigned On field wrapper */}
        <Label htmlFor="assignedOn">Assigned On</Label> {/* Assigned on label */}
        <Input id="assignedOn" type="date" value={formatDateInput(assignedOn)} onChange={(e) => setAssignedOn(e.target.value ? new Date(e.target.value) : new Date())} /> {/* Date input */}
      </div> {/* End Assigned On */}

      <div className="md:col-span-2 flex gap-3"> {/* Actions row spanning full width */}
        <Button type="submit" variant="hero">{editingTask ? "Update Task" : "Add Task"}</Button> {/* Submit action */}
        {editingTask && onSaved && ( // Conditionally render Cancel when editing
          <Button type="button" variant="outline" onClick={onSaved}>Cancel</Button> // Cancel action
        )}
      </div> {/* End Actions */}
    </form> // End form
  ); // End return
}; // End TaskForm component
