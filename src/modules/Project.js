import { Todo } from './Todo'; // Add this import at the top

export class Project {
  constructor(name) {
    this.id = Date.now().toString();
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
    return this;
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
    return this;
  }

  getTodo(todoId) {
    return this.todos.find(todo => todo.id === todoId);
  }
}

export function createProject(name) {
  return new Project(name);
}

export function createDefaultProject() {
  const defaultProject = new Project('Default Project');
  // Add a sample todo to the default project
  const sampleTodo = new Todo(
    'Welcome to TodoList', 
    'This is a sample todo to get you started', 
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    'medium'
  );
  defaultProject.addTodo(sampleTodo);
  return defaultProject;
}