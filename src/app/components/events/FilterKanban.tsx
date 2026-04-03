import { useState } from 'react';
import { Plus, MoreVertical, X, Check, Calendar } from 'lucide-react';
import { useTheme } from "next-themes";


interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: 'low' | 'normal' | 'major' | 'critical';
  assignee: string;
  deadline: string;
  completed: boolean;
  notes: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

interface Tag {
  name: string;
  color: string;
}

interface FilterSettings {
  assignee: string;
  deadlineStart: string;
  deadlineEnd: string;
  priority: 'low' | 'normal' | 'major' | 'critical' | null;
  completed: boolean;
}

const TAG_COLORS = [
  { name: 'purple', value: 'bg-purple-600' },
  { name: 'gray', value: 'bg-gray-600' },
  { name: 'pink', value: 'bg-pink-600' },
  { name: 'teal', value: 'bg-teal-600' },
  { name: 'blue', value: 'bg-blue-600' },
  { name: 'green', value: 'bg-green-600' },
  { name: 'yellow', value: 'bg-yellow-600' },
  { name: 'red', value: 'bg-red-600' },
  { name: 'indigo', value: 'bg-indigo-600' },
  { name: 'orange', value: 'bg-orange-600' },
];

export default function FilterKanban() {
  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [openTagEditor, setOpenTagEditor] = useState<{ taskId: string; columnId: string } | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('purple');
  const [openDatePicker, setOpenDatePicker] = useState<{ taskId: string; columnId: string } | null>(null);
  const [showDeadlineFilter, setShowDeadlineFilter] = useState(false);
  const [showPriorityFilter, setShowPriorityFilter] = useState(false);
  const [showAssigneeFilter, setShowAssigneeFilter] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { theme } = useTheme();

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    assignee: '',
    deadlineStart: '',
    deadlineEnd: '',
    priority: null,
    completed: false,
  });

  const [allTags, setAllTags] = useState<Tag[]>([
    { name: 'Design', color: 'purple' },
    { name: 'Backend', color: 'gray' },
    { name: 'UI', color: 'pink' },
    { name: 'UX', color: 'teal' },
    { name: 'Frontend', color: 'blue' },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      title: 'Frontend',
      color: 'yellow',
      tasks: [
        {
          id: '1',
          title: 'Untitled',
          description: 'Description goes here',
          tags: ['Design', 'Backend', 'UI'],
          priority: 'low',
          assignee: 'John Doe',
          deadline: '',
          completed: false,
          notes: 'Type here...'
        },
        {
          id: '2',
          title: 'Untitled',
          description: 'Description goes here',
          tags: ['UI', 'Backend'],
          priority: 'normal',
          assignee: 'Jane Smith',
          deadline: '',
          completed: false,
          notes: 'Type here...'
        }
      ]
    },
    {
      id: '2',
      title: 'Backend',
      color: 'green',
      tasks: [
        {
          id: '3',
          title: 'Untitled',
          description: 'Description goes here',
          tags: ['Design', 'UI', 'UX'],
          priority: 'critical',
          assignee: 'Mike Johnson',
          deadline: '',
          completed: false,
          notes: 'Type here...'
        }
      ]
    },
    {
      id: '3',
      title: 'Design',
      color: 'blue',
      tasks: [
        {
          id: '4',
          title: 'Untitled',
          description: 'Description goes here',
          tags: ['Design', 'Frontend'],
          priority: 'major',
          assignee: 'Sarah Williams',
          deadline: '',
          completed: true,
          notes: 'Type here...'
        }
      ]
    }
  ]);

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const addColumn = () => {
    const colors = ['yellow', 'green', 'blue', 'purple', 'red'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newColumn: Column = {
      id: Date.now().toString(),
      title: 'New Column',
      color: randomColor,
      tasks: []
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    setOpenColumnMenu(null);
  };

  const updateColumnColor = (columnId: string, color: string) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, color } : col
    ));
  };

  const updateColumnName = (columnId: string, name: string) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, title: name } : col
    ));
    setEditingColumn(null);
    setEditingColumnName('');
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Add description',
      tags: [],
      priority: 'low',
      assignee: 'Unassigned',
      deadline: '',
      completed: false,
      notes: 'Type here...'
    };

    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const updateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : col
    ));
  };

  const addTagToTask = (columnId: string, taskId: string, tagName: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId && !task.tags.includes(tagName)
                ? { ...task, tags: [...task.tags, tagName] }
                : task
            )
          }
        : col
    ));
  };

  const removeTagFromTask = (columnId: string, taskId: string, tagName: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId
                ? { ...task, tags: task.tags.filter(t => t !== tagName) }
                : task
            )
          }
        : col
    ));
  };

  const createNewTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        name: newTagName.trim(),
        color: newTagColor
      };
      setAllTags([...allTags, newTag]);
      setNewTagName('');
      setNewTagColor('purple');
    }
  };

  const deleteTag = (tagName: string) => {
    setAllTags(allTags.filter(tag => tag.name !== tagName));
    setColumns(columns.map(col => ({
      ...col,
      tasks: col.tasks.map(task => ({
        ...task,
        tags: task.tags.filter(t => t !== tagName)
      }))
    })));
  };

  const resetFilters = () => {
    setFilterSettings({
      assignee: '',
      deadlineStart: '',
      deadlineEnd: '',
      priority: null,
      completed: false,
    });
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      if (filterSettings.assignee && !task.assignee.toLowerCase().includes(filterSettings.assignee.toLowerCase())) {
        return false;
      }

      if (filterSettings.deadlineStart || filterSettings.deadlineEnd) {
        const taskDate = parseDate(task.deadline);
        if (!taskDate) return false;

        if (filterSettings.deadlineStart) {
          const startDate = parseDate(filterSettings.deadlineStart);
          if (startDate && taskDate < startDate) return false;
        }

        if (filterSettings.deadlineEnd) {
          const endDate = parseDate(filterSettings.deadlineEnd);
          if (endDate && taskDate > endDate) return false;
        }
      }

      if (filterSettings.priority && task.priority !== filterSettings.priority) {
        return false;
      }

      if (filterSettings.completed && !task.completed) {
        return false;
      }

      return true;
    });
  };

  const getTagColor = (tagName: string) => {
    const tag = allTags.find(t => t.name === tagName);
    return tag ? TAG_COLORS.find(c => c.name === tag.color)?.value || 'bg-gray-600' : 'bg-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-500';
      case 'normal': return 'bg-green-500';
      case 'major': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const borderColors = {
    yellow: 'border-yellow-500',
    green: 'border-green-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    red: 'border-red-500'
  };

  const isFilterActive = () => {
    return filterSettings.assignee !== '' ||
           filterSettings.deadlineStart !== '' ||
           filterSettings.deadlineEnd !== '' ||
           filterSettings.priority !== null ||
           filterSettings.completed;
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? 'dark' : ''}`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366F1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5558E3;
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-12">
        {/* Filters */}
        <div className="mb-8 flex items-center gap-6">
          {/* Assignee Filter */}
          <div className="relative">
            <button
              onClick={() => setShowAssigneeFilter(!showAssigneeFilter)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
                filterSettings.assignee !== ''
                  ? 'bg-[#6366F1] border-[#6366F1] text-white'
                  : 'bg-transparent border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>Исполнитель</span>
            </button>

            {showAssigneeFilter && (
              <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl z-10 w-64 border border-slate-400 dark:border-slate-900">
                <input
                  type="text"
                  value={filterSettings.assignee}
                  onChange={(e) => setFilterSettings({ ...filterSettings, assignee: e.target.value })}
                  placeholder="Введите имя исполнителя"
                  className="w-full bg-white dark:bg-slate-900 px-4 py-2 rounded-lg outline-none"
                />
              </div>
            )}
          </div>

          {/* Deadline Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDeadlineFilter(!showDeadlineFilter)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
                filterSettings.deadlineStart !== '' || filterSettings.deadlineEnd !== ''
                  ? 'bg-[#6366F1] border-[#6366F1] text-white'
                  : 'bg-transparent border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>Дедлайн</span>
            </button>

            {showDeadlineFilter && (
              <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl z-10 w-80 border border-slate-400 dark:border-slate-900">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Дата начала</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={filterSettings.deadlineStart}
                        onChange={(e) => setFilterSettings({ ...filterSettings, deadlineStart: e.target.value })}
                        placeholder="dd.mm.yyyy"
                        className="flex-1 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg outline-none"
                      />
                      <button
                        onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                    {showStartDatePicker && (
                      <div className="mt-2">
                        <input
                          type="date"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFilterSettings({ ...filterSettings, deadlineStart: formatDate(date) });
                            setShowStartDatePicker(false);
                          }}
                          className="w-full bg-white dark:bg-slate-900 px-3 py-2 rounded-lg outline-none text-white"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Дата окончания</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={filterSettings.deadlineEnd}
                        onChange={(e) => setFilterSettings({ ...filterSettings, deadlineEnd: e.target.value })}
                        placeholder="dd.mm.yyyy"
                        className="flex-1 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg outline-none"
                      />
                      <button
                        onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                    {showEndDatePicker && (
                      <div className="mt-2">
                        <input
                          type="date"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFilterSettings({ ...filterSettings, deadlineEnd: formatDate(date) });
                            setShowEndDatePicker(false);
                          }}
                          className="w-full bg-white dark:bg-slate-900 px-3 py-2 rounded-lg outline-none text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityFilter(!showPriorityFilter)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
                filterSettings.priority !== null
                  ? 'bg-[#6366F1] border-[#6366F1] text-white'
                  : 'bg-transparent border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>Приоритет</span>
            </button>

            {showPriorityFilter && (
              <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl z-10 w-48 border border-slate-400 dark:border-slate-900">
                <div className="space-y-2">
                  {(['low', 'normal', 'major', 'critical'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFilterSettings({ ...filterSettings, priority })}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                        filterSettings.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-700'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Completed Filter */}
          <button
            onClick={() => setFilterSettings({ ...filterSettings, completed: !filterSettings.completed })}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
              filterSettings.completed
                ? 'bg-[#6366F1] border-[#6366F1] text-white'
                : 'bg-transparent border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
            }`}
          >
            <span>Выполнено</span>
          </button>

          <button
            onClick={resetFilters}
            className={`px-8 py-3 rounded-xl transition-colors ${
              isFilterActive()
                ? 'bg-[#6366F1] hover:bg-[#5558E3]'
                : 'bg-gray-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
            }`}
          >
            Сбросить фильтр
          </button>
        </div>

        {/* Columns Container */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map(column => {
            const filteredTasks = filterTasks(column.tasks);
            const incompleteTasks = column.tasks.filter(t => !t.completed).length;

            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-[400px] bg-white dark:bg-slate-800 rounded-3xl border-2 ${borderColors[column.color as keyof typeof borderColors] || 'border-slate-300 dark:border-slate-600'} p-6`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {editingColumn === column.id ? (
                      <input
                        type="text"
                        value={editingColumnName}
                        onChange={(e) => setEditingColumnName(e.target.value)}
                        onBlur={() => updateColumnName(column.id, editingColumnName)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateColumnName(column.id, editingColumnName);
                          }
                        }}
                        className="bg-white dark:bg-slate-900 px-3 py-1 rounded text-xl font-semibold outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3
                        className="text-xl font-semibold cursor-pointer"
                        onClick={() => {
                          setEditingColumn(column.id);
                          setEditingColumnName(column.title);
                        }}
                      >
                        {column.title}
                      </h3>
                    )}
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                      {incompleteTasks}
                    </span>
                  </div>

                  {/* Column Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenColumnMenu(openColumnMenu === column.id ? null : column.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openColumnMenu === column.id && (
                      <div className="absolute right-0 top-10 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xl z-10 w-48 border border-slate-200 dark:border-slate-800">
                        {/* Color Picker */}
                        <div className="mb-4">
                          <p className="text-sm mb-2 text-gray-400">Цвет колонки</p>
                          <div className="flex gap-2 flex-wrap">
                            {['yellow', 'green', 'blue', 'purple', 'red'].map(color => (
                              <button
                                key={color}
                                onClick={() => updateColumnColor(column.id, color)}
                                className={`w-8 h-8 rounded-full border-2 ${
                                  column.color === color ? 'border-white' : 'border-transparent'
                                } ${
                                  color === 'yellow' ? 'bg-yellow-500' :
                                  color === 'green' ? 'bg-green-500' :
                                  color === 'blue' ? 'bg-blue-500' :
                                  color === 'purple' ? 'bg-purple-500' :
                                  'bg-red-500'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteColumn(column.id)}
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                        >
                          Удалить колонку
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => addTask(column.id)}
                  className="w-full flex items-center gap-2 px-4 py-3 mb-6 bg-transparent border border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Добавить задачу</span>
                </button>

                {/* Tasks */}
                <div className="space-y-4">
                  {filteredTasks.map(task => {
                    const descriptionRows = Math.min(4, Math.max(1, task.description.split('\n').length));
                    const notesRows = Math.min(5, Math.max(1, task.notes.split('\n').length));

                    return (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-slate-800"
                      >
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tagName, idx) => (
                            <span
                              key={idx}
                              className={`${getTagColor(tagName)} px-3 py-1 rounded-lg text-xs flex items-center gap-1 group`}
                            >
                              {tagName}
                              <button
                                onClick={() => removeTagFromTask(column.id, task.id, tagName)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => setOpenTagEditor({ taskId: task.id, columnId: column.id })}
                            className="px-3 py-1 border border-dashed border-gray-500 rounded-lg text-xs hover:bg-white/5 transition-colors"
                          >
                            + Тег
                          </button>
                        </div>

                        {/* Tag Editor Modal */}
                        {openTagEditor?.taskId === task.id && openTagEditor?.columnId === column.id && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOpenTagEditor(null)}>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-[400px] max-h-[80vh] overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Управление тегами</h3>
                                <button onClick={() => setOpenTagEditor(null)}>
                                  <X className="w-6 h-6" />
                                </button>
                              </div>

                              {/* Existing Tags */}
                              <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-3">Выберите существующий тег</p>
                                <div className="flex flex-wrap gap-2">
                                  {allTags.map((tag, idx) => {
                                    const isSelected = task.tags.includes(tag.name);
                                    return (
                                      <div key={idx} className="relative group">
                                        <button
                                          onClick={() => {
                                            if (isSelected) {
                                              removeTagFromTask(column.id, task.id, tag.name);
                                            } else {
                                              addTagToTask(column.id, task.id, tag.name);
                                            }
                                          }}
                                          className={`${TAG_COLORS.find(c => c.name === tag.color)?.value || 'bg-gray-600'} px-3 py-1 rounded-lg text-xs flex items-center gap-2`}
                                        >
                                          {tag.name}
                                          {isSelected && <Check className="w-3 h-3" />}
                                        </button>
                                        <button
                                          onClick={() => deleteTag(tag.name)}
                                          className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Create New Tag */}
                              <div>
                                <p className="text-sm text-gray-400 mb-3">Создать новый тег</p>
                                <input
                                  type="text"
                                  value={newTagName}
                                  onChange={(e) => setNewTagName(e.target.value)}
                                  placeholder="Название тега"
                                  className="w-full bg-white dark:bg-slate-900 px-4 py-2 rounded-lg mb-3 outline-none border border-slate-200 dark:border-slate-800"
                                />
                                <div className="flex gap-2 mb-3 flex-wrap">
                                  {TAG_COLORS.map(color => (
                                    <button
                                      key={color.name}
                                      onClick={() => setNewTagColor(color.name)}
                                      className={`w-10 h-10 rounded-lg ${color.value} border-2 ${
                                        newTagColor === color.name ? 'border-white' : 'border-transparent'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <button
                                  onClick={() => {
                                    createNewTag();
                                    if (newTagName.trim()) {
                                      addTagToTask(column.id, task.id, newTagName.trim());
                                    }
                                  }}
                                  className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] rounded-lg transition-colors"
                                >
                                  Создать и добавить
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Task Title */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => updateTask(column.id, task.id, { completed: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTask(column.id, task.id, { title: e.target.value })}
                            className="flex-1 bg-transparent text-lg outline-none"
                          />
                        </div>

                        {/* Description */}
                        <textarea
                          value={task.description}
                          onChange={(e) => updateTask(column.id, task.id, { description: e.target.value })}
                          className="w-full bg-transparent text-slate-500 dark:text-[#828282] text-sm outline-none resize-none custom-scrollbar"
                          rows={descriptionRows}
                          style={{ minHeight: '1.5rem', maxHeight: '6rem' }}
                        />

                        {/* Priority Selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Priority</span>
                          <div className="flex gap-2">
                            {(['low', 'normal', 'major', 'critical'] as const).map((priority) => (
                              <button
                                key={priority}
                                onClick={() => updateTask(column.id, task.id, { priority })}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  task.priority === priority ? getPriorityColor(priority) : 'bg-gray-700'
                                }`}
                              >
                                {priority === 'low' ? 'Low' : priority === 'normal' ? 'Norm' : priority === 'major' ? 'Maj' : 'Crit'}
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
                            className="w-full bg-transparent outline-none resize-none custom-scrollbar"
                            rows={notesRows}
                            style={{ minHeight: '2rem', maxHeight: '7.5rem' }}
                          />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <input
                            type="text"
                            value={task.assignee}
                            onChange={(e) => updateTask(column.id, task.id, { assignee: e.target.value })}
                            placeholder="Assignee"
                            className="flex-1 bg-transparent text-xs text-gray-400 outline-none"
                          />
                          <div className="relative flex items-center gap-1">
                            <input
                              type="text"
                              value={task.deadline}
                              onChange={(e) => updateTask(column.id, task.id, { deadline: e.target.value })}
                              placeholder="dd.mm.yyyy"
                              className="w-20 bg-transparent text-xs text-gray-400 outline-none text-right"
                            />
                            <button
                              onClick={() => setOpenDatePicker({ taskId: task.id, columnId: column.id })}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-gray-400" />
                            </button>
                            {openDatePicker?.taskId === task.id && openDatePicker?.columnId === column.id && (
                              <div className="absolute right-0 bottom-8 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl z-10 border border-slate-200 dark:border-slate-800">
                                <input
                                  type="date"
                                  onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    updateTask(column.id, task.id, { deadline: formatDate(date) });
                                    setOpenDatePicker(null);
                                  }}
                                  className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg outline-none text-white border border-slate-200 dark:border-slate-800"
                                />
                              </div>
                            )}
                          </div>
                        </div>
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
            className="flex-shrink-0 w-[400px] h-[200px] bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors"
          >
            <Plus className="w-8 h-8" />
            <span className="text-xl">Добавить колонку</span>
          </button>
        </div>
      </div>
    </div>
  );
}
