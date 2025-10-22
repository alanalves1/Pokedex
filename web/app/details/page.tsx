"use client";                             //  Marca esse componente como Client Component no Next.js
import React, { useState } from "react"; //  Importa React e o hook useState - useState permite criar estados reativos que disparam re-render do componente

type Task = {                           //  Tipagem das tarefas - Em TypeScript, definimos um tipo Task para deixar o código mais seguro e previsível
    id: number;
    text: string;
    completed: boolean;
};

export default function TaskList() {               // Estado que guarda todas as tarefas
    const [tasks, setTasks] = useState<Task[]>([]); // Inicialmente vazio // Estado que guarda o texto digitado no input
    const [newTask, setNewTask] = useState("");     // Inicialmente string vazia
    // Quando chamamos setTasks ou setNewTask, o React re-renderiza o componente automaticamente


    function addTask() {
        if (!newTask.trim()) return; // Evita tarefas vazias

        const task: Task = {
            id: Date.now(),   // ID único usando timestamp
            text: newTask,    // Texto digitado no input
            completed: false  // Começa como não concluída
        };


        setTasks([...tasks, task]); // Atualiza a lista de tarefas // Criamos um novo array incluindo a nova tarefa


        setNewTask(""); // Limpa o input após adicionar // Prepara input para próxima tarefa
    }

    // Explicação técnica:
    // React detecta que o array mudou → re-renderiza a lista automaticamente

    function toggleTask(id: number) {
        setTasks(
            tasks.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed } // Inverte completed da tarefa selecionada
                    : task
            )
        );

        // 🧠 React compara o Virtual DOM antigo com o novo e atualiza só o item que mudou
    }

    function removeTask(id: number) {
        // Filtra a lista removendo a tarefa com o ID fornecido
        setTasks(tasks.filter(task => task.id !== id));

        // 💡 Cria um novo array → importante para que React detecte a mudança
        // React re-renderiza automaticamente a lista atualizada
    }


    return (
        <div className="p-4 w-full max-w-md bg-white dark:bg-black rounded shadow">
            <h1 className="text-xl font-bold mb-4 text-black dark:text-white">
                Lista de Tarefas
            </h1>

            {/* Input e botão Add */}
            <div className="flex mb-4 gap-2">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded"
                    value={newTask}                       // Sincroniza com estado newTask
                    onChange={e => setNewTask(e.target.value)} // Atualiza estado ao digitar
                    placeholder="Digite uma tarefa"
                />
                <button
                    className="bg-blue-500 text-white px-4 rounded"
                    onClick={addTask} // Chama função para adicionar
                >
                    Add
                </button>
            </div>

            {/* Lista de tarefas */}
            <ul>
                {tasks.map(task => (
                    <li
                        key={task.id} // Chave única para React identificar cada item
                        className="flex justify-between items-center mb-2"
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}         // Mostra se a tarefa está concluída
                            onChange={() => toggleTask(task.id)} // Alterna completed
                        />
                        <span
                            className={`flex-1 ml-2 ${task.completed
                                ? "line-through text-gray-500"
                                : "text-black dark:text-white"
                                }`}
                        >
                            {task.text}
                        </span>
                        <button
                            className="text-red-500 ml-2"
                            onClick={() => removeTask(task.id)} // Remove tarefa
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

