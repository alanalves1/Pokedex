// Indica que este componente deve ser renderizado no cliente (não no servidor)
"use client"

// Importações necessárias do React e componentes UI
import { useState } from "react" // Hook para gerenciar estado local
import { Button } from "@/components/ui/button" // Componente de botão reutilizável
import { Input } from "@/components/ui/input" // Componente de input de texto
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Componentes de card para estrutura
import { Checkbox } from "@/components/ui/checkbox" // Componente de checkbox
import { Plus, Trash2 } from "lucide-react" // Ícones de adicionar e deletar
import { cn } from "@/lib/utils" // Função utilitária para combinar classes CSS

// Interface que define a estrutura de uma tarefa
interface Task {
  id: string // Identificador único da tarefa
  text: string // Texto/descrição da tarefa
  completed: boolean // Status de conclusão (true = concluída, false = pendente)
  createdAt: Date // Data de criação da tarefa
}

// Interface que define as propriedades do componente TaskItem
interface TaskItemProps {
  task: Task // Objeto da tarefa a ser exibida
  onToggle: (id: string) => void // Função callback para alternar status de conclusão
  onDelete: (id: string) => void // Função callback para deletar a tarefa
}

// Subcomponente que renderiza um item individual da lista de tarefas
function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    // Container principal do item com hover effect e transição suave
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
      {/* Checkbox para marcar/desmarcar tarefa como concluída */}
      <Checkbox
        id={task.id} // ID único para associar com o label
        checked={task.completed} // Estado atual do checkbox
        onCheckedChange={() => onToggle(task.id)} // Chama função de toggle quando clicado
        className="shrink-0" // Impede que o checkbox encolha
      />

      {/* Label com o texto da tarefa, clicável para alternar o checkbox */}
      <label
        htmlFor={task.id} // Associa o label ao checkbox pelo ID
        className={cn(
          "flex-1 text-sm cursor-pointer select-none transition-all", // Classes base
          task.completed && "line-through text-muted-foreground", // Se concluída, adiciona riscado e cor esmaecida
        )}
      >
        {task.text} {/* Exibe o texto da tarefa */}
      </label>

      {/* Botão de deletar que aparece apenas no hover do item */}
      <Button
        variant="ghost" // Estilo fantasma (transparente)
        size="icon" // Tamanho quadrado para ícone
        onClick={() => onDelete(task.id)} // Chama função de deletar quando clicado
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
      // opacity-0: invisível por padrão
      // group-hover:opacity-100: aparece quando o mouse passa sobre o item pai
      >
        <Trash2 className="h-4 w-4" /> {/* Ícone de lixeira */}
        <span className="sr-only">Remover tarefa</span> {/* Texto para leitores de tela */}
      </Button>
    </div>
  )
}

// Interface que define as propriedades opcionais do componente TaskList
interface TaskListProps {
  title?: string // Título do card (opcional)
  description?: string // Descrição do card (opcional)
  className?: string // Classes CSS adicionais (opcional)
}

// Componente principal que gerencia toda a lista de tarefas
export function TaskList({
  title = "Minhas Tarefas", // Valor padrão para o título
  description = "Gerencie suas tarefas diárias", // Valor padrão para a descrição
  className, // Classes CSS personalizadas
}: TaskListProps) {
  // Estado que armazena o array de todas as tarefas
  const [tasks, setTasks] = useState<Task[]>([])

  // Estado que armazena o valor atual do input de nova tarefa
  const [inputValue, setInputValue] = useState("")

  // Função para adicionar uma nova tarefa à lista
  const addTask = () => {
    // Verifica se o input não está vazio (após remover espaços)
    if (inputValue.trim()) {
      // Cria um novo objeto de tarefa
      const newTask: Task = {
        id: crypto.randomUUID(), // Gera um ID único usando a API nativa do navegador
        text: inputValue.trim(), // Remove espaços extras do início e fim
        completed: false, // Nova tarefa sempre começa como não concluída
        createdAt: new Date(), // Registra a data/hora de criação
      }
      // Adiciona a nova tarefa no início do array (spread operator)
      setTasks([newTask, ...tasks])
      // Limpa o input após adicionar
      setInputValue("")
    }
  }

  // Função para alternar o status de conclusão de uma tarefa
  const toggleTask = (id: string) => {
    // Mapeia todas as tarefas, modificando apenas a que tem o ID correspondente
    setTasks(
      tasks.map(
        (task) =>
          task.id === id // Se o ID corresponde
            ? { ...task, completed: !task.completed } // Inverte o status de completed
            : task, // Caso contrário, mantém a tarefa inalterada
      ),
    )
  }

  // Função para remover uma tarefa da lista
  const deleteTask = (id: string) => {
    // Filtra o array, mantendo apenas as tarefas cujo ID é diferente do fornecido
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Função que detecta quando a tecla Enter é pressionada no input
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      // Se a tecla pressionada for Enter
      addTask() // Adiciona a tarefa
    }
  }

  // Calcula quantas tarefas estão concluídas
  const completedCount = tasks.filter((task) => task.completed).length

  // Calcula o total de tarefas
  const totalCount = tasks.length

  return (
    // Card principal que envolve todo o componente
    <Card className={cn("w-full max-w-2xl", className)}>
      {/* Cabeçalho do card com título e descrição */}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {/* Conteúdo principal do card */}
      <CardContent className="space-y-4">
        {/* Seção de input para adicionar nova tarefa */}
        <div className="flex gap-2">
          {/* Campo de texto para digitar a nova tarefa */}
          <Input
            type="text"
            placeholder="Adicionar nova tarefa..." // Texto de placeholder
            value={inputValue} // Valor controlado pelo estado
            onChange={(e) => setInputValue(e.target.value)} // Atualiza o estado a cada digitação
            onKeyDown={handleKeyDown} // Detecta quando Enter é pressionado
            className="flex-1" // Ocupa todo o espaço disponível
          />
          {/* Botão para adicionar tarefa */}
          <Button
            onClick={addTask} // Chama função de adicionar quando clicado
            size="icon" // Tamanho quadrado para ícone
            disabled={!inputValue.trim()} // Desabilita se o input estiver vazio
          >
            <Plus className="h-4 w-4" /> {/* Ícone de mais */}
            <span className="sr-only">Adicionar tarefa</span> {/* Texto para leitores de tela */}
          </Button>
        </div>

        {/* Container da lista de tarefas */}
        <div className="space-y-2">
          {/* Verifica se não há tarefas */}
          {tasks.length === 0 ? (
            // Mensagem de estado vazio
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Nenhuma tarefa ainda.</p>
              <p className="text-xs mt-1">Adicione uma tarefa para começar!</p>
            </div>
          ) : (
            // Renderiza cada tarefa usando o componente TaskItem
            tasks.map((task) => (
              <TaskItem
                key={task.id} // Key única para otimização do React
                task={task} // Passa o objeto da tarefa
                onToggle={toggleTask} // Passa a função de toggle
                onDelete={deleteTask} // Passa a função de deletar
              />
            ))
          )}
        </div>
      </CardContent>

      {/* Footer com contador de progresso - só aparece se houver tarefas */}
      {totalCount > 0 && (
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            {/* Texto mostrando quantas tarefas foram concluídas */}
            <span>
              {completedCount} de {totalCount} concluída{totalCount !== 1 ? "s" : ""}
            </span>

            {/* Barra de progresso visual */}
            <div className="flex items-center gap-2">
              {/* Container da barra de progresso */}
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                {/* Barra de preenchimento que cresce conforme as tarefas são concluídas */}
                <div
                  className="h-full bg-primary transition-all duration-300" // Transição suave de 300ms
                  style={{
                    // Calcula a porcentagem de conclusão e aplica como largura
                    width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
              {/* Porcentagem numérica */}
              <span className="font-medium">
                {/* Calcula e arredonda a porcentagem de conclusão */}
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
