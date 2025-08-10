// Import React and all pieces of the dashboard UI
import React, { useMemo, useState } from "react"; // React APIs used here
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components for layout
import { TaskForm } from "@/components/tasks/TaskForm"; // Task form for add/edit
import { TaskFilters } from "@/components/tasks/TaskFilters"; // Filter controls
import { TaskTable } from "@/components/tasks/TaskTable"; // Table listing
import { Task, Priority } from "@/types/task"; // Types for Task domain
import { TaskProvider, useTasks } from "@/context/TaskContext"; // Context provider and hook

// Internal Dashboard component separated to reuse provider only once
const Dashboard: React.FC = () => { // Dashboard component rendering the page
  const { state } = useTasks(); // Access state to derive options
  const [editing, setEditing] = useState<Task | null>(null); // Track task being edited or null

  const categories = useMemo(() => state.tasks.map((t) => t.category), [state.tasks]); // Derive category options
  const users = useMemo(() => state.tasks.map((t) => t.assignedUser), [state.tasks]); // Derive assignee options

  return ( // Render full dashboard
    <main className="container mx-auto py-10 space-y-8"> {/* Main content area */}
      <header> {/* Page header grouping */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Team Task Tracker – A Simple Project Management Dashboard</h1> {/* Primary H1 for SEO */}
        <p className="text-muted-foreground mt-2">Manage tasks, priorities, due dates, and assignments with fast multi-filtering.</p> {/* Supporting description */}
      </header> {/* End header */}

      <Card className="shadow-elegant"> {/* Card for add/edit form */}
        <CardHeader> {/* Card header */}
          <CardTitle>{editing ? "Edit Task" : "Add a New Task"}</CardTitle> {/* Title switches based on mode */}
        </CardHeader> {/* End header */}
        <CardContent> {/* Card content */}
          <TaskForm editingTask={editing ?? undefined} onSaved={() => setEditing(null)} /> {/* Task form */}
        </CardContent> {/* End content */}
      </Card> {/* End form card */}

      <Card className="shadow-elegant"> {/* Card for filters */}
        <CardHeader> {/* Header */}
          <CardTitle>Filters</CardTitle> {/* Title */}
        </CardHeader> {/* End header */}
        <CardContent> {/* Content */}
          <TaskFilters categories={categories} users={users} /> {/* Filter controls */}
        </CardContent> {/* End content */}
      </Card> {/* End filters card */}

      <Card className="shadow-elegant"> {/* Card for table */}
        <CardHeader> {/* Header */}
          <CardTitle>Tasks</CardTitle> {/* Title */}
        </CardHeader> {/* End header */}
        <CardContent> {/* Content */}
          <TaskTable onEdit={(t) => setEditing(t)} /> {/* Tasks table with edit handler */}
        </CardContent> {/* End content */}
      </Card> {/* End table card */}

      <script // JSON-LD structured data for SEO
        type="application/ld+json" // Script type
        dangerouslySetInnerHTML={{ // Inject JSON string
          __html: JSON.stringify({ // Convert object to string
            "@context": "https://schema.org", // Schema context
            "@type": "WebApplication", // Type representing a web app
            name: "Team Task Tracker", // App name
            description: "A simple project management dashboard for team tasks.", // App description
          }), // End stringify
        }} // End prop
      /> {/* End script */}
    </main> // End main
  ); // End return
}; // End Dashboard

// Export default page with provider so state is available across the page
const Index: React.FC = () => { // Index page component
  return ( // Render provider wrapping the dashboard
    <TaskProvider> {/* Provide global task store */}
      <Dashboard /> {/* Render the dashboard UI */}
    </TaskProvider> // End provider
  ); // End return
}; // End Index

export default Index; // Default export
