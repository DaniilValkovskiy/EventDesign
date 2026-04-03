import React, { useState } from "react";
import { Plus, Calendar, Search, Trash2 } from "lucide-react";

type Priority = "low" | "normal" | "major" | "critical";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  notes: string;
  assignee: string;
  deadline: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function FilterKanban() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        {
          id: "task-1",
          title: "Design Homepage",
          priority: "major",
          notes: "Need to include the new logo.",
          assignee: "Sarah Chen",
          deadline: "15.04.2026",
        },
      ],
    },
    {
      id: "col-2",
      title: "In Progress",
      tasks: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState<{ taskId: string; columnId: string } | null>(null);

  const notesRows = 2; // Fixed rows for textarea

  // Добавление новой колонки
  const addColumn = () => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: "New Column",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  // Обновление заголовка колонки
  const updateColumnTitle = (columnId: string, title: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title } : col)));
  };

  // Добавление новой задачи в колонку
  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "",
      priority: "normal",
      notes: "",
      assignee: "",
      deadline: "",
    };
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
  };

  // Обновление полей задачи
  const updateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(
      columns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
        };
      })
    );
  };

  // Удаление задачи
  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(
      columns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  };

  // Цвета для приоритетов (поддерживают светлую и темную темы)
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "normal":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "major":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Форматирование даты из Date в строку dd.mm.yyyy
  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  // Фильтрация колонок и задач по поиску
  const filteredColumns = columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl w-full max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, assignees, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none flex-1 text-sm text-slate-700 dark:text-white"
        />
      </div>

      {/* Kanban Board Container */}
      <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex items-start gap-6 w-max">
          {filteredColumns.map((column) => {
            return (
              <div
                key={column.id}
                className="flex-shrink-0 w-[400px] bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 flex flex-col gap-4 border border-slate-200 dark:border-slate-800"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2">
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                    className="font-semibold text-lg bg-transparent outline-none text-slate-800 dark:text-white w-2/3"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                    <button
                      onClick={() => addTask(column.id)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="flex flex-col gap-3">
                  {column.tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/60 flex flex-col gap-4"
                      >
                        {/* Task Title & Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <textarea
                            value={task.title}
                            onChange={(e) => updateTask(column.id, task.id, { title: e.target.value })}
                            placeholder="Task title..."
                            className="font-medium text-slate-800 dark:text-white bg-transparent outline-none resize-none w-full"
                            rows={1}
                          />
                          <button
                            onClick={() => deleteTask(column.id, task.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Priority Selector (Твой код начинается отсюда) */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-gray-400">Priority</span>
                          <div className="flex gap-2">
                            {(["low", "normal", "major", "critical"] as const).map((priority) => (
                              <button
                                key={priority}
                                onClick={() => updateTask(column.id, task.id, { priority })}
                                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                                  task.priority === priority
                                    ? getPriorityColor(priority)
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                                }`}
                              >
                                {priority === "low"
                                  ? "Low"
                                  : priority === "normal"
                                  ? "Norm"
                                  : priority === "major"
                                  ? "Maj"
                                  : "Crit"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="text-xs text-slate-500 dark:text-[#828282] border-t border-slate-200 dark:border-slate-700 pt-3">
                          <span className="block mb-1">Notes</span>
                          <textarea
                            value={task.notes}
                            onChange={(e) => updateTask(column.id, task.id, { notes: e.target.value })}
                            className="w-full bg-transparent outline-none resize-none custom-scrollbar text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600"
                            placeholder="Add notes here..."
                            rows={notesRows}
                            style={{ minHeight: "2rem", maxHeight: "7.5rem" }}
                          />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <input
                            type="text"
                            value={task.assignee}
                            onChange={(e) => updateTask(column.id, task.id, { assignee: e.target.value })}
                            placeholder="Assignee"
                            className="flex-1 bg-transparent text-xs text-slate-600 dark:text-gray-400 outline-none"
                          />
                          <div className="relative flex items-center gap-1">
                            <input
                              type="text"
                              value={task.deadline}
                              onChange={(e) => updateTask(column.id, task.id, { deadline: e.target.value })}
                              placeholder="dd.mm.yyyy"
                              className="w-20 bg-transparent text-xs text-slate-600 dark:text-gray-400 outline-none text-right"
                            />
                            <button
                              onClick={() => setOpenDatePicker({ taskId: task.id, columnId: column.id })}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                            </button>
                            {openDatePicker?.taskId === task.id && openDatePicker?.columnId === column.id && (
                              <div className="absolute right-0 bottom-8 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl z-10 border border-slate-200 dark:border-slate-700">
                                <input
                                  type="date"
                                  onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    updateTask(column.id, task.id, { deadline: formatDate(date) });
                                    setOpenDatePicker(null);
                                  }}
                                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg outline-none text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Конец твоей структуры карточки */}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Add Column Button */}
          <button
            onClick={addColumn}
            className="flex-shrink-0 w-[400px] h-[150px] bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500 transition-all"
          >
            <Plus className="w-8 h-8" />
            <span className="text-xl font-medium">Добавить колонку</span>
          </button>
        </div>
      </div>
    </div>
  );
}