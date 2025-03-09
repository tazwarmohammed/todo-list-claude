// src/dom/render.js
import { format } from 'date-fns';

export function initializeUI() {
  const appContainer = document.getElementById('app');
  console.log("App container found:", appContainer); // Debug line
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="app-container">
      <aside class="sidebar">
        <h2>Projects</h2>
        <ul id="projects-list"></ul>
        <button id="new-project-btn">+ New Project</button>
        <button id="clear-storage-btn" class="danger-btn">Clear All Data</button>
      </aside>
      <main class="main-content">
        <div class="project-header">
          <h1 id="current-project-title"></h1>
          <button id="new-todo-btn">+ New Todo</button>
        </div>
        <div id="todos-container"></div>
      </main>
      <div id="modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div id="modal-body"></div>
        </div>
      </div>
    </div>
  `;

  console.log("UI initialized"); // Debug line
}

export function renderProjects(projects, currentProject) {
  const projectsList = document.getElementById('projects-list');
  if (!projectsList) return;

  projectsList.innerHTML = '';
  
  projects.forEach(project => {
    const li = document.createElement('li');
    li.dataset.id = project.id;
    li.textContent = project.name;
    
    if (currentProject && project.id === currentProject.id) {
      li.classList.add('active');
    }
    
    projectsList.appendChild(li);
  });
}

export function renderTodos(project) {
  const todosContainer = document.getElementById('todos-container');
  const projectTitle = document.getElementById('current-project-title');
  
  if (!todosContainer || !projectTitle || !project) return;
  
  projectTitle.textContent = project.name;
  todosContainer.innerHTML = '';
  
  if (project.todos.length === 0) {
    todosContainer.innerHTML = '<p class="empty-state">No todos yet. Create your first todo!</p>';
    return;
  }
  
  project.todos.forEach(todo => {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo-item');
    todoElement.dataset.id = todo.id;
    
    // Add priority class
    todoElement.classList.add(`priority-${todo.priority}`);
    
    // Add completed class if todo is completed
    if (todo.completed) {
      todoElement.classList.add('completed');
    }
    
    // Format the date using date-fns
    let formattedDate = 'No due date';
    if (todo.dueDate) {
      try {
        formattedDate = format(new Date(todo.dueDate), 'MMM dd, yyyy');
      } catch (e) {
        console.error('Error formatting date:', e);
      }
    }
    
    todoElement.innerHTML = `
      <div class="todo-header">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <h3 class="todo-title">${todo.title}</h3>
        <div class="todo-actions">
          <span class="todo-date">${formattedDate}</span>
          <button class="edit-todo-btn">Edit</button>
          <button class="delete-todo-btn">Delete</button>
        </div>
      </div>
    `;
    
    todosContainer.appendChild(todoElement);
  });
}

export function renderTodoModal(todo = null, isEdit = false) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  const title = isEdit ? 'Edit Todo' : 'New Todo';
  const todoDate = todo && todo.dueDate ? todo.dueDate : '';
  const priorityOptions = ['low', 'medium', 'high'];
  
  modalBody.innerHTML = `
    <h2>${title}</h2>
    <form id="todo-form">
      ${todo ? `<input type="hidden" name="todoId" value="${todo.id}">` : ''}
      <div class="form-group">
        <label for="todo-title">Title</label>
        <input type="text" id="todo-title" name="title" value="${todo ? todo.title : ''}" required>
      </div>
      <div class="form-group">
        <label for="todo-description">Description</label>
        <textarea id="todo-description" name="description">${todo ? todo.description : ''}</textarea>
      </div>
      <div class="form-group">
        <label for="todo-date">Due Date</label>
        <input type="date" id="todo-date" name="dueDate" value="${todoDate}">
      </div>
      <div class="form-group">
        <label for="todo-priority">Priority</label>
        <select id="todo-priority" name="priority">
          ${priorityOptions.map(option => 
            `<option value="${option}" ${todo && todo.priority === option ? 'selected' : ''}>${
              option.charAt(0).toUpperCase() + option.slice(1)
            }</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="todo-notes">Notes</label>
        <textarea id="todo-notes" name="notes">${todo ? todo.notes : ''}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Save</button>
      </div>
    </form>
  `;
  
  modal.style.display = 'block';
}

export function renderProjectModal() {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <h2>New Project</h2>
    <form id="project-form">
      <div class="form-group">
        <label for="project-name">Project Name</label>
        <input type="text" id="project-name" name="name" required>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Create Project</button>
      </div>
    </form>
  `;
  
  modal.style.display = 'block';
}

export function renderClearStorageModal() {
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h2>Clear All Data</h2>
    <p>Are you sure you want to delete all projects and todos? This action cannot be undone.</p>
    <div class="form-actions">
      <button class="cancel-btn">Cancel</button>
      <button id="confirm-clear-btn" class="danger-btn">Delete All</button>
    </div>
  `;
  
  document.getElementById('modal').style.display = 'block';
}