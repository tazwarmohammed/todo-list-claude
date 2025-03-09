// src/modules/Storage.js
import { Project } from './Project';
import { Todo } from './Todo';

export const STORAGE_KEY = 'todoListProjects';

// Save projects to localStorage
export function saveToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Load projects from localStorage
export function loadFromStorage() {
  try {
    const projectsData = localStorage.getItem(STORAGE_KEY);
    if (!projectsData) return null;
    
    const parsedData = JSON.parse(projectsData);
    
    // Reconstruct the Projects and Todos with their methods
    return parsedData.map(projectData => {
      const project = new Project(projectData.name);
      project.id = projectData.id;
      
      // Reconstruct Todo objects with their methods
      project.todos = projectData.todos.map(todoData => {
        const todo = new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.notes,
          todoData.checklist,
          todoData.completed
        );
        todo.id = todoData.id;
        todo.createdAt = new Date(todoData.createdAt);
        return todo;
      });
      
      return project;
    });
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}