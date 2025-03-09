import './styles.css';
import { loadFromStorage, saveToStorage } from './modules/Storage';
import { createDefaultProject } from './modules/Project';
import { renderProjects, renderTodos, initializeUI } from './dom/render';
import { setupEventListeners } from './dom/handlers';

// Add this debug line
console.log("Script is running!");

// This is our main app state
let projects = [];
let currentProject = null;

// Initialize the application
function initializeApp() {
  console.log("Initializing app...");
  
  // Try to load existing data or create default project
  const storedProjects = loadFromStorage();
  
  if (storedProjects && storedProjects.length > 0) {
    projects = storedProjects;
    currentProject = projects[0];
  } else {
    const defaultProject = createDefaultProject();
    projects = [defaultProject];
    currentProject = defaultProject;
    saveToStorage(projects);
  }

  console.log("Projects loaded:", projects);

  // Initialize UI and render projects
  initializeUI();
  renderProjects(projects, currentProject);
  renderTodos(currentProject);
  setupEventListeners(projects, currentProject);
}

// Make our app state available to other modules
export function getProjects() {
  return projects;
}

export function getCurrentProject() {
  return currentProject;
}

export function setCurrentProject(project) {
  currentProject = project;
  renderTodos(currentProject);
}

export function updateAppState(newProjects) {
  projects = newProjects;
  saveToStorage(projects);
  renderProjects(projects, currentProject);
  renderTodos(currentProject);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Add this to check if the event listener is working
console.log("Event listener added for DOMContentLoaded");