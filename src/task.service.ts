 import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'taskboard_tasks';
  private storage: Storage;
/*
When the application starts for the very first time, the
initial task information comes from a hardcoded array of
tasks inside the seedInitialData() method in your
TaskService.
*/
 
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.storage = localStorage;
      this.seedInitialData();
    } else {
      // Proporciona una implementación "falsa" de Storage en el servidor para evitar errores.
      this.storage = {
        length: 0,
        clear: () => {},
        getItem: () => null,
        key: () => null,
        removeItem: () => {},
        setItem: () => {},
      };
    }
  }

  private getTasksFromStorage(): Task[] {
    const tasksJson = this.storage.getItem(this.STORAGE_KEY);
    if (tasksJson) {
      // Es importante convertir las fechas de string a objetos Date al leer
      return JSON.parse(tasksJson, (key, value) => {
        if (key === 'dueDate' && value) {
          return new Date(value);
        }
        return value;
      });
    }
    return [];
  }

 /*
  The line effectively says: "Go to the browser's local 
  storage, find the item stored under the key 'taskboard_tasks'
  , and put its value into a new variable called tasksJson."

const tasksJson = this.storage.getItem(this.STORAGE_KEY);  

Think of localStorage as a small, persistent filing cabinet
built directly into the user's web browser. The data you save
there will remain even if the user closes the browser tab and
opens it again later.
  
The data is placed into localStorage by the 
saveTasksToStorage method in your task.service.ts file.

// in c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\
// task.service.ts
private saveTasksToStorage(tasks: Task[]): void {
  this.storage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));}

1. Where the Data is Saved (Written To Storage)
The data is placed into localStorage by the saveTasksToStorage
method in your task.service.ts file.

this.storage.setItem(...): This is the command that says "save
this data". It takes the current array of Task objects,
converts it into a JSON string (JSON.stringify(tasks)),
and stores that string in localStorage under the key
'taskboard_tasks'

 method is called whenever you make a change to the tasks, such as:

When the application first loads (seedInitialData).
When you add a new task (addTask).
When you update a task, like dragging it to a new column 
(updateTask).
When you delete a task (deleteTask).
    
  */
/*
TIP
While the application is running, it doesn't read from
localStorage every time it needs to display a task. Instead,
it loads the data from localStorage once and keeps it in
memory for fast access.

*/




  /*
  Reading Tasks (getTasksFromStorage): When the
  application loads, this method is called to
  retrieve the saved tasks. It reads the JSON 
  string from localStorage and converts it back 
  into an array of Task objects.
  
 Using localStorage ensures that if you add a task,
 close the browser tab, and open it again, your
 tasks will still be there.
*/

/*
 The function above return a
 tasks object, the first time return null

 export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  dueDate?: Date; // Optional Date object
  assignedTo?: string;
  column: 'To Do' | 'In Progress' | 'Done';
}
This is in taskmodel.ts

Now storage is
The purpose of the storage property is to persist
your task data. It acts as a simple, local database
for your task board application.

Saving Tasks (saveTasksToStorage): When you add,
update, or delete a task, this method is called. 
It takes the array of tasks, converts it to a JSON
string using JSON.stringify(), and saves it to 
localStorage under the key 'taskboard_tasks'.

Look at this
private saveTasksToStorage(tasks: Task[]): void {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
*/

private saveTasksToStorage(tasks: Task[]): void {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
/*
Here, you use this.STORAGE_KEY to tell setItem what to name
the data you are saving. This is how the tasks are saved
under the name 'taskboard_tasks'.
*/
  
  private seedInitialData(): void {
    if (!this.storage.getItem(this.STORAGE_KEY)) {
      // Si no hay información con el label de 'taskboard_tasks'
     //Entonces se cargan los datos 
      const initialTasks: Task[] = [
        { id: '1', title: 'Diseñar UI para el login', description: 'Crear mockups en Figma', priority: 'High', tags: ['UI', 'Diseño'], column: 'To Do', assignedTo: 'Alfredo' },
        { id: '2', title: 'Implementar Drag & Drop', description: 'Usar Angular CDK', priority: 'Medium', tags: ['Frontend', 'Angular'], column: 'In Progress', assignedTo: 'Alfredo', dueDate: new Date() },
        { id: '3', title: 'Configurar CI/CD', description: 'Pipeline en GitHub Actions', priority: 'Low', tags: ['DevOps'], column: 'Done', assignedTo: 'Alfredo' },
      ];
      this.saveTasksToStorage(initialTasks);
      //Data is Saved: The initialTasks array is saved to the browser's localStorage.
      //Se guarda en saveTasksToStorage con el KEY de STORAGE_KEY.
    }
  }
/*
BoardComponent Loads: Finally, your BoardComponent loads, 
calls this.taskService.getTasks(), which now reads this
initial data from localStorage.
*/

  getTasks(): Task[] {
    return this.getTasksFromStorage();
  }
  //Llamada desde boardcomponent.ts
// getTaskById llamada a  esta función recibe id:string y
//regresa o task o undefined
  getTaskById(id: string): Task | undefined {
    const tasks = this.getTasksFromStorage();
    // Toma las tasks del localstorage
    return tasks.find(task => task.id === id);
    //Regresa el task que sea igual a id
  }
/*
"To add a new task, give me all its details, but you are
 NOT allowed to give me an id or a column. I will handle
 those myself."
*/
  addTask(task: Omit<Task, 'id' | 'column'>): void {
    const tasks = this.getTasksFromStorage();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(), // ID simple basado en el timestamp
      column: 'To Do'
    };
    tasks.push(newTask);
    this.saveTasksToStorage(tasks);
  }

  updateTask(updatedTask: Task): void {
    let tasks = this.getTasksFromStorage();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasksToStorage(tasks);
    }
  }

  deleteTask(id: string): void {
    let tasks = this.getTasksFromStorage();
  //"Get the current list of all tasks from storage and put
  //  it into a temporary variable named tasks."
    tasks = tasks.filter(task => task.id !== id);
  // Toma todas las tasks sin el id de borrar y guardalas
  // de nuevo
    this.saveTasksToStorage(tasks);
  }
}
/*
1. El Constructor: Preparando el Almacenamiento
typescript
 Show full code block 
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.storage = localStorage;
      this.seedInitialData();
    } else {
      // ... implementación "falsa" ...
    }
  }
Detección de Plataforma: Lo primero que hace es comprobar si la aplicación se está ejecutando en un navegador (isPlatformBrowser). Esto es una práctica muy importante para la compatibilidad con Server-Side Rendering (SSR).
Si está en el Navegador: Asigna el localStorage del navegador a la variable this.storage. localStorage es un pequeño almacén de datos que persiste incluso si cierras la pestaña. Luego, llama a seedInitialData().
Si está en el Servidor: Como en el servidor no existe localStorage, crea un objeto "falso" que imita la API de Storage pero no hace nada. Esto evita que la aplicación se rompa durante el renderizado en el servidor.
2. Métodos Privados: La Lógica Interna
Estos métodos son para uso exclusivo dentro del servicio.

getTasksFromStorage():

Lee los datos de localStorage usando la clave 'taskboard_tasks'.
Los datos se guardan como texto (JSON), así que usa JSON.parse() para convertirlos de nuevo en un array de objetos.
Muy importante: Incluye una función "reviver" en JSON.parse. Esta función detecta las fechas de vencimiento (dueDate), que se guardan como texto, y las convierte de nuevo en objetos Date de JavaScript. Sin esto, las fechas no funcionarían correctamente.
saveTasksToStorage(tasks):

Toma un array de tareas.
Usa JSON.stringify() para convertirlo en una cadena de texto JSON.
Guarda esa cadena en localStorage.
seedInitialData():

Comprueba si ya existen tareas guardadas.
Si no hay nada (es la primera vez que el usuario abre la app), crea una lista de tareas de ejemplo.
Guarda estas tareas iniciales para que el usuario tenga algo con qué interactuar desde el principio.
3. Métodos Públicos: La API del Servicio
Estos son los métodos que los otros componentes pueden llamar.

getTasks(): Devuelve todas las tareas almacenadas.
getTaskById(id): Busca y devuelve una única tarea por su ID.
addTask(task):
Recibe los datos de una nueva tarea desde el formulario del diálogo.
Le asigna un ID único (usando la fecha actual como un número) y la coloca por defecto en la columna 'To Do'.
Añade la nueva tarea a la lista y guarda la lista actualizada.
updateTask(updatedTask):
Recibe una tarea con datos modificados (por ejemplo, cuando la arrastras a una nueva columna o la editas).
Busca la tarea original en la lista por su ID y la reemplaza con la versión actualizada.
Guarda la lista actualizada.
deleteTask(id):
Recibe el ID de una tarea a eliminar.
Usa el método filter para crear un nuevo array que excluye la tarea con ese ID.
Guarda este nuevo array (sin la tarea eliminada)
*/