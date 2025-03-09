export class Todo {
  constructor(title, description, dueDate, priority, notes = '', checklist = [], completed = false) {
    this.id = Date.now().toString(); // simple unique id
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority; // 'low', 'medium', 'high'
    this.notes = notes;
    this.checklist = checklist;
    this.completed = completed;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
    return this;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
    return this;
  }

  update(data) {
    this.title = data.title || this.title;
    this.description = data.description || this.description;
    this.dueDate = data.dueDate || this.dueDate;
    this.priority = data.priority || this.priority;
    this.notes = data.notes || this.notes;
    return this;
  }

  addChecklistItem(item) {
    this.checklist.push({
      id: Date.now().toString(),
      text: item,
      completed: false
    });
    return this;
  }

  toggleChecklistItem(itemId) {
    const item = this.checklist.find(item => item.id === itemId);
    if (item) item.completed = !item.completed;
    return this;
  }
}

// Function to create a new todo
export function createTodo(title, description, dueDate, priority, notes, checklist) {
  return new Todo(title, description, dueDate, priority, notes, checklist);
}