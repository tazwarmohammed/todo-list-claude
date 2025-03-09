// src/dom/handlers.js
import { createTodo } from '../modules/Todo';
import { createProject } from '../modules/Project';
import { saveToStorage } from '../modules/Storage';
import { STORAGE_KEY } from '../modules/Storage';
import { renderTodoModal, renderProjectModal, renderTodos, renderProjects, renderClearStorageModal } from './render';
import { getCurrentProject, setCurrentProject, getProjects, updateAppState } from '../index';

export function setupEventListeners() {
  // Setup event delegation for dynamic elements
  document.addEventListener('click', handleGlobalClicks);
  
  // Setup form submission events
  document.addEventListener('submit', handleFormSubmissions);
}

function handleGlobalClicks(e) {
  // Project selection
  if (e.target.closest('#projects-list li')) {
    handleProjectSelection(e);
  }
  
  // New Todo button
  if (e.target.matches('#new-todo-btn')) {
    renderTodoModal();
  }
  
  // New Project button
  if (e.target.matches('#new-project-btn')) {
    renderProjectModal();
  }
  
  // Todo checkbox
  if (e.target.matches('.todo-checkbox')) {
    handleTodoCheckbox(e);
  }
  
  // Edit Todo button
  if (e.target.matches('.edit-todo-btn')) {
    handleEditTodo(e);
  }
  
  // Delete Todo button
  if (e.target.matches('.delete-todo-btn')) {
    handleDeleteTodo(e);
  }
  
  // Modal close button or cancel button
  if (e.target.matches('.close-modal') || e.target.matches('.cancel-btn')) {
    closeModal();
  }
  
  // Clear storage button
  if (e.target.matches('#clear-storage-btn')) {
    renderClearStorageModal();
  }
  
  if (e.target.matches('#confirm-clear-btn')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload(); // Reload the page to reset the app
  }
}

function handleFormSubmissions(e) {
  if (e.target.matches('#todo-form')) {
    e.preventDefault();
    handleTodoForm(e);
  }
  
  if (e.target.matches('#project-form')) {
    e.preventDefault();
    handleProjectForm(e);
  }
}

function handleProjectSelection(e) {
  const projectId = e.target.dataset.id;
  const projects = getProjects();
  const selectedProject = projects.find(project => project.id === projectId);
  
  if (selectedProject) {
    setCurrentProject(selectedProject);
    
    // Update active project in UI
    const projectItems = document.querySelectorAll('#projects-list li');
    projectItems.forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
  }
}

function handleTodoCheckbox(e) {
  const todoElement = e.target.closest('.todo-item');
  const todoId = todoElement.dataset.id;
  const currentProject = getCurrentProject();
  
  const todo = currentProject.getTodo(todoId);
  if (todo) {
    todo.toggleComplete();
    saveToStorage(getProjects());
    
    // Update UI to reflect completed state
    todoElement.classList.toggle('completed');
  }
}

function handleEditTodo(e) {
  const todoElement = e.target.closest('.todo-item');
  const todoId = todoElement.dataset.id;
  const currentProject = getCurrentProject();
  
  const todo = currentProject.getTodo(todoId);
  if (todo) {
    renderTodoModal(todo, true);
  }
}

function handleDeleteTodo(e) {
  const todoElement = e.target.closest('.todo-item');
  const todoId = todoElement.dataset.id;
  const currentProject = getCurrentProject();
  const projects = getProjects();
  
  currentProject.removeTodo(todoId);
  saveToStorage(projects);
  renderTodos(currentProject);
}

function handleTodoForm(e) {
  const formData = new FormData(e.target);
  const todoData = {
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
    notes: formData.get('notes')
  };
  
  const todoId = formData.get('todoId');
  const currentProject = getCurrentProject();
  const projects = getProjects();
  
  // If todoId exists, we're editing an existing todo
  if (todoId) {
    const todo = currentProject.getTodo(todoId);
    if (todo) {
      todo.update(todoData);
    }
  } else {
    // Creating a new todo
    const newTodo = createTodo(
      todoData.title, 
      todoData.description, 
      todoData.dueDate, 
      todoData.priority, 
      todoData.notes
    );
    currentProject.addTodo(newTodo);
  }
  
  saveToStorage(projects);
  renderTodos(currentProject);
  closeModal();
}

function handleProjectForm(e) {
  const formData = new FormData(e.target);
  const projectName = formData.get('name');
  
  if (projectName) {
    const newProject = createProject(projectName);
    const projects = getProjects();
    projects.push(newProject);
    
    updateAppState(projects);
    setCurrentProject(newProject);
    closeModal();
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}