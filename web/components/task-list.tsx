"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
    id: string
    text: string
    completed: boolean
    createdAt: Date
}

interface TaskItemProps {
    task: Task
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
            <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => onToggle(task.id)} className="shrink-0" />
            <label
                htmlFor={task.id}
                className={cn(
                    "flex-1 text-sm cursor-pointer select-none transition-all",
                    task.completed && "line-through text-muted-foreground",
                )}
            >
                {task.text}
            </label>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover tarefa</span>
            </Button>
        </div>
    )
}

interface TaskListProps {
    title?: string
    description?: string
    className?: string
}

export function TaskList({
    title = "Minhas Tarefas",
    description = "Gerencie suas tarefas diárias",
    className,
}: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [inputValue, setInputValue] = useState("")

    const addTask = () => {
        if (inputValue.trim()) {
            const newTask: Task = {
                id: crypto.randomUUID(),
                text: inputValue.trim(),
                completed: false,
                createdAt: new Date(),
            }
            setTasks([newTask, ...tasks])
            setInputValue("")
        }
    }

    const toggleTask = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const handleKeyDown = (e: { key: string }) => {
        if (e.key === "Enter") {
            addTask()
        }
    }

    const completedCount = tasks.filter((task) => task.completed).length
    const totalCount = tasks.length

    return (
        <Card className={cn("w-full max-w-2xl", className)}>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Input para adicionar nova tarefa */}
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Adicionar nova tarefa..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                    />
                    <Button onClick={addTask} size="icon" disabled={!inputValue.trim()}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Adicionar tarefa</span>
                    </Button>
                </div>

                {/* Lista de tarefas */}
                <div className="space-y-2">
                    {tasks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">Nenhuma tarefa ainda.</p>
                            <p className="text-xs mt-1">Adicione uma tarefa para começar!</p>
                        </div>
                    ) : (
                        tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)
                    )}
                </div>
            </CardContent>

            {/* Footer com contador de progresso */}
            {totalCount > 0 && (
                <CardFooter className="border-t pt-4">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <span>
                            {completedCount} de {totalCount} concluída{totalCount !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="font-medium">
                                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
