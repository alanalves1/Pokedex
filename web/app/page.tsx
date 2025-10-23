import { TaskList } from "@/components/task-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <TaskList />
    </main>
  )
}
