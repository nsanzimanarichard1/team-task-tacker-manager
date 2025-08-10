// Import React and icons for actions
import React from "react"; // React for rendering
import { Button } from "@/components/ui/button"; // Button for actions
import { Badge } from "@/components/ui/badge"; // Badge for priority display
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components
import { useTasks } from "@/context/TaskContext"; // Task context hook
import { Task } from "@/types/task"; // Task type
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react"; // Action icons

// Define the props for TaskTable allowing parent to handle edit selection
interface TaskTableProps { // Props interface for TaskTable
  onEdit: (task: Task) => void; // Callback when user wants to edit a task
} // End props interface

// Helper to render a visual badge for priority values
function PriorityBadge({ value }: { value: Task["priority"] }) { // Priority badge component
  const color = // Choose badge variant color classes
    value === "High" // Check for High
      ? "bg-destructive text-destructive-foreground" // High -> destructive color
      : value === "Medium" // Check for Medium
      ? "bg-secondary text-secondary-foreground" // Medium -> secondary color
      : "bg-accent text-accent-foreground"; // Low -> accent color
  return <Badge className={color}>{value}</Badge>; // Render badge with selected color and text
} // End PriorityBadge

// Main TaskTable component that lists tasks and actions
export const TaskTable: React.FC<TaskTableProps> = ({ onEdit }) => { // Component declaration
  const { filteredTasks, toggleTask, deleteTask } = useTasks(); // Access tasks and actions from context

  return ( // Render table structure
    <div className="rounded-lg border border-border overflow-hidden"> {/* Bordered container */}
      <Table> {/* Table root */}
        <TableHeader> {/* Table header */}
          <TableRow> {/* Header row */}
            <TableHead>Status</TableHead> {/* Status column */}
            <TableHead>Task</TableHead> {/* Task name column */}
            <TableHead>Priority</TableHead> {/* Priority column */}
            <TableHead>Category</TableHead> {/* Category column */}
            <TableHead>Due</TableHead> {/* Due date column */}
            <TableHead>Assignee</TableHead> {/* Assignee column */}
            <TableHead className="text-right">Actions</TableHead> {/* Actions column */}
          </TableRow> {/* End header row */}
        </TableHeader> {/* End header */}
        <TableBody> {/* Table body */}
          {filteredTasks.map((t) => ( // Iterate through tasks
            <TableRow key={t.id}> {/* Row per task */}
              <TableCell> {/* Status cell */}
                <button
                  className="inline-flex items-center gap-2"
                  onClick={() => toggleTask(t.id)}
                  aria-label={t.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {t.completed ? (
                    <CheckCircle2 className="text-foreground" /> // Completed icon
                  ) : (
                    <Circle className="text-muted-foreground" /> // Incomplete icon
                  )}
                </button>
              </TableCell> {/* End status */}
              <TableCell className="font-medium">{t.taskName}</TableCell> {/* Task name */}
              <TableCell><PriorityBadge value={t.priority} /></TableCell> {/* Priority badge */}
              <TableCell>{t.category}</TableCell> {/* Category */}
              <TableCell>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</TableCell> {/* Due date formatted */}
              <TableCell>{t.assignedUser}</TableCell> {/* Assignee */}
              <TableCell className="text-right"> {/* Actions */}
                <div className="inline-flex gap-2"> {/* Actions group */}
                  <Button variant="outline" size="sm" onClick={() => onEdit(t)} aria-label="Edit task"> {/* Edit */}
                    <Pencil className="mr-2" /> Edit {/* Icon and text */}
                  </Button> {/* End edit */}
                  <Button variant="destructive" size="sm" onClick={() => deleteTask(t.id)} aria-label="Delete task"> {/* Delete */}
                    <Trash2 className="mr-2" /> Delete {/* Icon and text */}
                  </Button> {/* End delete */}
                </div> {/* End group */}
              </TableCell> {/* End actions */}
            </TableRow> // End row
          ))} {/* End map */}
          {filteredTasks.length === 0 && ( // Empty state when nothing to show
            <TableRow> {/* Single empty row */}
              <TableCell colSpan={7} className="text-center text-muted-foreground"> {/* Span all cols */}
                No tasks match the selected filters. {/* Empty message */}
              </TableCell> {/* End cell */}
            </TableRow> // End row
          )} {/* End empty */}
        </TableBody> {/* End body */}
      </Table> {/* End table */}
    </div> // End container
  ); // End return
}; // End TaskTable component
