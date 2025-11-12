import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from 'task.model';
import { TaskService } from 'task.service';
import { TaskCardComponent } from '@components/task-card/task-card.component';
import { TaskDialogComponent } from '@components/task-dialog/task-dialog.component';
/*
@angular/core: This is the heart of the Angular framework.
Component: A decorator that marks a class as an Angular
component and provides its metadata (like its selector,
template, and styles).
computed: A function to create a read-only signal
(filteredTasks, allTags) that derives its value from
other signals and automatically updates when they change.
inject: The modern, function-based way to get services and
other dependencies. You use it to get TaskService and 
MatDialog.
OnInit: A lifecycle hook interface. By implementing ngOnInit,
you can run initialization code (like loadTasks()) when the
component is first created.
signal: A function to create a writable signal (tasks, 
searchText, selectedTags), which is a reactive value that 
can notify other parts of your app when it changes.
@angular/common:
CommonModule: Provides essential Angular directives, 
including the @for control flow block you use to loop 
through your columns and tasks in the template.

Angular Core Imports
typescript
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
@angular/core: This is the heart of the Angular framework.
Component: A decorator that marks a class as an Angular
component and provides its metadata (like its selector,
template, and styles).
computed: A function to create a read-only signal 
(filteredTasks, allTags) that derives its value from other
signals and automatically updates when they change.
inject: The modern, function-based way to get
services and other dependencies. You use it to get
TaskService and MatDialog.
OnInit: A lifecycle hook interface. By implementing
ngOnInit, you can run initialization code (like
loadTasks()) when the component is first created.
signal: A function to create a writable signal
(tasks, searchText, selectedTags), which is a reactive
value that can notify other parts of your app when it changes.
@angular/common:
CommonModule: Provides essential Angular
directives, including the @for control flow block
you use to loop through your columns and tasks in the template.
Angular CDK (Component Dev Kit) Imports
typescript
import { CdkDragDrop, moveItemInArray, transferArrayItem,
DragDropModule } from '@angular/cdk/drag-drop';
This group brings in everything needed for the 
drag-and-drop functionality.

DragDropModule: The main module that provides all the 
drag-and-drop directives like cdkDropList, cdkDrag, and 
cdkDropListGroup.
CdkDragDrop: The type of the event object that your 
drop() method receives. It contains all the information
about the drop, like which item was moved and where
it came from and went to.
moveItemInArray: A utility function that helps reorder
an item within the same array. You use this when a
task is dropped in the same column it started in.
transferArrayItem: A utility function that moves an
item from one array to another. You use this when a
task is dragged to a different column.

Angular Material Imports
typescript
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
These imports provide the UI components from the Angular Material library.

MatDialog: The service you inject to open modal dialogs.
You use it to open the TaskDialogComponent.
MatFormFieldModule: Provides the <mat-form-field> component,
which wraps the tag filter dropdown to give it standard
Material Design styling.
MatSelectModule: Provides the <mat-select> component used
for the "Filtrar por etiqueta" dropdown.
MatOptionModule: Provides the <mat-option> component that
represents each individual tag inside the <mat-select>
dropdown.
MatButtonModule: Provides the mat-flat-button directive used
for the "Nueva Tarea" button.
MatIconModule: Provides the <mat-icon> component,
used for the add icon on the "Nueva Tarea" button.
*/

type TaskColumns = 'To Do' | 'In Progress' | 'Done';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    TaskCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule
    ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  private taskService = inject(TaskService);
  /*
    The inject() function is a part of Angular's core
    framework.

  The TaskService is responsible for handling all data
  operations like getting, adding, and updating tasks
  from localStorage.

  Private taskService: The provided TaskService
  instance is stored in a private property named
  taskService. Making it private means it can only
  be accessed from within the BoardComponent

  look
  import { TaskService } from 'task.service';
  */
    
  private dialog = inject(MatDialog);
/*
It injects Angular Material's MatDialog service, which
is used to open modal dialog windows.
In this component, you use this.dialog to open the 
TaskDialogComponent when a user wants to create a 
new task or edit an existing one.
*/
  columns: TaskColumns[] = ['To Do', 'In Progress', 'Done'];
  /*
  This array is used directly in your board.component.html
  template with an @for loop to create the three
  columns of your task board. It defines the
  structure and titles of your board.
    */ 
  tasks = signal<Task[]>([]);
  /*
  The type <Task[]> tells TypeScript that this signal
  will always hold a value that is an array of Task
  objects.
  
  A signal is a reactive value. When you update it
  using tasks.set(...)), any part of your application
  that depends on it (like the filteredTasks computed
  signal) will be automatically notified and will
  re-evaluate its own value. This is the foundation
  of the reactivity in your component.
  */

  // Filtros
  searchText = signal('');
/*
signal(''): This initializes the signal with a starting
value of an empty string ('').
What it does: This signal is designed to hold the
current text that the user has typed into the 
"Buscar por título" (Search by title) input field.
How it's updated: In your component, the onSearch 
method is called whenever the user types in that input.
This method updates the signal's value:
*/

  selectedTags = signal<string[]>([]);//array initialize in empty array
/*1
selectedTags = signal<string[]>([]);
This line creates another writable signal named
selectedTags.
*/

/*
How it's updated: The onFilterByTag method is called
when the user changes their selection in the dropdown.
This method updates the signal with the new array of 
selected tags:
typescript onFilterByTag(tags: string[]): void {
  this.selectedTags.set(tags); //
   <-- Updates the signal
} 
*/

/* 
Observation
How They Work Together
These two signals, searchText and selectedTags, are the inputs for your filteredTasks computed signal.

typescript
filteredTasks = computed(() => {
  const allTasks = this.tasks();
  const search = this.searchText().toLowerCase(); // <-- Reads the searchText signal
  const tags = this.selectedTags();             // <-- Reads the selectedTags signal
  // ... filtering logic ...
});
Because filteredTasks depends on searchText and 
selectedTags, whenever you update either of those 
signals (by calling .set()), Angular's reactivity 
system automatically knows that filteredTasks needs
to be recalculated. This, in turn, updates the UI 
to show the correctly filtered tasks.
*/

/*
allTags = computed(() => { ... }); This creates a
computed signal named allTags. A computed signal is
a read-only value that automatically recalculates
itself whenever the signals it depends on change. 
In this case, allTags depends on the this.tasks signal.
So, whenever a task is added, removed, or updated,
this code will re-run automatically to generate a 
fresh list of tags.
*/ 

  allTags = computed(() => {
    const tags = new Set<string>();
    this.tasks().forEach(task => task.tags.forEach((tag: string) => tags.add(tag)));
    return Array.from(tags);
  });
/*

To get the current value out of a signal, you call it like
a function: this.tasks().
So, this.tasks() returns the array of all tasks currently
 loaded in your application.
"For each task in my list of all tasks..."
go through each of that task's tags one by one..."
and add that tag to my master list of unique tags."

  this.tasks is an Angular Signal that holds the complete
  array of all your Task objects.
  Calling it as a function, this.tasks(), retrieves
  that array of tasks.

  forEach((tag: string) => ...)

This is the second, nested loop. It iterates over every tag
(a string) inside the task.tags array.
For each tag, it executes the final piece of code

tags.add(tag) adds the current tag string to the Set. 
If the tag is already in the Set, this action does nothing,
automatically preventing duplicates.

"For each task in my list of tasks, go through each of its
tags, and add that tag to a Set."
*/

  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const search = this.searchText().toLowerCase();
    const tags = this.selectedTags();
    /*
    This code is the beginning of a computed signal called
    filteredTasks. The purpose of this signal is to create
    a new, filtered list of tasks that will be displayed on
    the board, based on the user's search and tag selections.

This declares a new read-only signal named filteredTasks.
The computed function from Angular Signals means that the
value of filteredTasks will be automatically recalculated
whenever any of the other signals inside its function change.
It's a powerful way to create reactive, derived state.

const search = this.searchText().toLowerCase();
This reads the current value from the searchText signal, 
which holds the text the user has typed into the search input.
.toLowerCase() is used to ensure the search will be
case-insensitive.This creates another dependency: 
filteredTasks now also depends on searchText. Every time
the user types a character in the search box, this entire 
computed function will re-run.

const tags = this.selectedTags();
This reads the current value from the selectedTags signal,
which holds an array of the tags the user has selected from
the filter dropdown. This creates the final dependency:
filteredTasks now depends on selectedTags. Whenever the user
adds or removes a tag from the filter, this function will 
re-run.   
*/ 
    const filtered = allTasks.filter(task => {
      /*
      The purpose of this line is to start the process of
      creating a new array of tasks, called filtered, 
      which will contain only the tasks that match the 
      user's search and tag filter criteria.
       
      
      */
      const titleMatch = task.title.toLowerCase().includes(search);
      /*
       The purpose of the line const titleMatch = 
       task.title.toLowerCase().includes(search); is to
       check if a specific task's title matches the text 
       the user has typed into the search box. It returns 
       true if it's a match and false if it's not.
      
      */
      const tagMatch = tags.length === 0 || tags.every(tag => task.tags.includes(tag));
/*

Meaning: This whole expression asks the question: 
"For the current task, does its list of tags include
 every single one of the tags the user is filtering by?"

Example Walkthrough
Let's imagine the user has selected ['UI', 'Angular'] as
their filter tags.

Task A has tags ['UI', 'Angular', 'Frontend'].

tags.length === 0 is false.
The .every() method runs.
Test 1: Does ['UI', 'Angular', 'Frontend'] include 'UI'? Yes.
Test 2: Does ['UI', 'Angular', 'Frontend'] include 'Angular'? Yes.
Since all tests passed, .every() returns true.
tagMatch is true. Task A is shown.
Task B has tags ['UI', 'Design'].

tags.length === 0 is false.
The .every() method runs.
Test 1: Does ['UI', 'Design'] include 'UI'? Yes.
Test 2: Does ['UI', 'Design'] include 'Angular'? No.
Since one test failed, .every() immediately stops and returns false.
tagMatch is false. Task B is hidden.
*/
      
      return titleMatch && tagMatch; //Only return if two are true
    });

    return this.groupTasksByColumn(filtered);
  });

  /*
 This line uses the standard JavaScript filter method
 on the allTasks array (which holds all the tasks from
 your tasks signal). It creates a new array called 
 filtered that will only contain the tasks that pass the
 test inside the curly braces {}.

For each task in allTasks, the function does two checks:
titleMatch and tagMatch.

const titleMatch = task.title.toLowerCase().includes(search);
This line checks if the task's title matches the search text.

task.title.toLowerCase(): Takes the task's title and
converts it to all lowercase.
.includes(search): Checks if that lowercase title
includes the search string (which was also converted
to lowercase in the first part of the function).
  
The result, titleMatch, is a boolean (true or false).
It's true if the search text is found anywhere in the
task's title.

const tagMatch = tags.length === 0 || tags.every(tag => 
task.tags.includes(tag));
This line checks if the task has the tags selected by
the user. It's a bit more complex, so let's split it:
tags.length === 0: This checks if the tags array (from
the selectedTags signal) is empty. If it is, it means 
the user hasn't selected any tags to filter by. In this
case, tagMatch is immediately true, and all tasks pass 
this check.
||: This is a logical "OR". If the first part is true,
the second part is skipped.
tags.every(tag => task.tags.includes(tag)):
This part only runs if the user has selected filter tags.
The .every() method checks if all of the selected tags
meet a condition.
The condition is task.tags.includes(tag),
which checks if the current task's own list of tags
includes the specific filter tag.
So, tagMatch is true if either no tags are selected
 OR the task contains all of the selected tags
*/

  ngOnInit(): void {
    this.loadTasks();
  }
/*
ngOnInit is a lifecycle hook in Angular. Think of it as
a special method that Angular automatically calls at a
specific moment in a component's life.

Specifically, ngOnInit is called once, right after Angular has:

Created the component.
Set up all its initial properties (like the injected
taskService and dialog).

It is the standard and recommended place to put
any initialization logic that the component needs
to run when it first appears on the screen.
*/

  loadTasks() {
    this.tasks.set(this.taskService.getTasks());
  }
/*
signal<Task[]>([]): This function call creates a special
reactive wrapper around a value. In this case, the
initial value is an empty array []. This wrapper is
called a writable signal.

this.tasks.set(newValue): This method completely replaces
the current value inside the sig nal with the newValue
you provide. In your loadTasks method:

 loadTasks() {
    this.tasks.set(this.taskService.getTasks());

    Remember the declaration
    private taskService = inject(TaskService);

this is from. on 

getTasks(): Task[] {
 return this.getTasksFromStorage();
  }
task.services.ts
 

*/

/*
In this point, everything its Ok.
Now we are going to analize the next function
*/
  groupTasksByColumn(tasks: Task[]): Record<TaskColumns, Task[]> {
    const grouped: Record<TaskColumns, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };
/*
Okey TIP
the inteface of a task is like this
[
  { id: '1', title: 'Task A', ..., column: 'To Do' },
  { id: '2', title: 'Task B', ..., column: 'In Progress' },
  { id: '3', title: 'Task C', ..., column: 'To Do' }
]
But i need an other structure.

groupTasksByColumn solve the problem.

So,   const grouped: Record<TaskColumns, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };
  
  Transforms the structure like this

  // The desired "grouped" object structure
{
  'To Do': [
    { id: '1', title: 'Task A', ..., column: 'To Do' },
    { id: '3', title: 'Task C', ..., column: 'To Do' }
  ],
  'In Progress': [
    { id: '2', title: 'Task B', ..., column: 'In Progress' }
  ],
  'Done': []
}

In html code this will be:

<!-- in c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\app\components\board\board.component.html -->

@for (column of columns; track column) {
  <!-- This outer loop runs 3 times, for 'To Do', 'In Progress', and 'Done' -->
  <div class="... column ...">
    <h3>{{ column }}</h3>
    
    <!-- Here is the magic! -->
    <div cdkDropList [cdkDropListData]="filteredTasks()[column]" ...>
      
      <!-- This inner loop gets the correct array of tasks for the current column -->
      @for (task of filteredTasks()[column]; track task.id) {
        <app-task-card [task]="task"></app-task-card>
      }
    </div>
  </div>
}


groupTasksByColumn(tasks: Task[]): ... (The Function Signature)
This defines a function named groupTasksByColumn that accepts 
one argument: tasks, which is an array of Task objects.
The : Record<TaskColumns, Task[]> part specifies what the
function will return.
This functions accepts an Objects Tasks, and returns
Record<TaskColumns, Task[]> 

describes an object that must have:

A key named 'To Do' whose value is an array of Task objects.
A key named 'In Progress' whose value is an array of Task 
objects.
A key named 'Done' whose value is an array of Task objects.

Example:
const groupedTasks: Record<TaskColumns, Task[]> = {
  'To Do': [
    // An array of tasks with column: 'To Do'
    { id: '1', title: 'First task', ..., column: 'To Do' },
    { id: '5', title: 'Another task', ..., column: 'To Do' }
  ],
  'In Progress': [
    // An array of tasks with column: 'In Progress'
    { id: '2', title: 'In-flight task', ..., column: 'In Progress' }
  ],
  'Done': [
    // An array of tasks with column: 'Done'
    { id: '3', title: 'Finished task', ..., column: 'Done' }
  ]
};

*/

    tasks.forEach(task => {
      grouped[task.column as TaskColumns]?.push(task);
    });

    return grouped;
  }
  /*
  .push(task)
This is the standard JavaScript method for adding an element
to the end of an array.
It takes the current task object and adds it to the array
 that was selected in the previous steps.
  
However, if a task somehow had an invalid column
(e.g., 'Archived'), this ?. would prevent the code
from crashing with an error like "Cannot read properties
of undefined (reading 'push')".

Imagine the loop is processing a task where task.column is 'To Do'. The line of code effectively becomes:

grouped['To Do']?.push(task);

This finds the 'To Do' array inside the grouped object and
pushes the current task into it. After the forEach loop has
finished running for all tasks, the grouped object will have
 been transformed from a set of empty arrays into a structure
 where each array is filled with the tasks belonging to that
 column.
*/



/*
It receives one argument: an event object.
The type of this object is CdkDragDrop<Task[]>, which comes
from the Angular CDK's DragDropModule. This object is packed
with useful information about the drag-and-drop action that
just finished.

The generic <Task[]> part is very important. It tells
TypeScript that the data associated with each drop list
(cdkDropListData) is an array of Task objects.

if (event.previousContainer === event.container) 
This part of the code what is crucial to determine what
kind of drop happened.

event.previousContainer: This property on the event object
refers to the drop list (the column) where the drag started.

event.container: This property refers to the drop list
(the column) where the item was dropped.

/*
This if block will execute only when the user drags a task
card and drops it back into the same column they picked it
up from.

The code inside this if block will then be responsible
for updating the array for that specific column to reflect
the new order of the tasks. The else block that follows
handles the case where the task is moved to a different
column.
*/

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const task = event.item.data as Task;
/*
event.item: This refers to the CdkDrag item that was
being dragged (the <app-task-card>).
event.item.data: This is the data you associated 
with the draggable item. In your board.component.html,
the [cdkDrag] directive is on your <app-task-card>
component. The CDK is smart enough to associate the
component instance with the drag item, and since your
TaskCardComponent has an @Input() named task, this data
effectively represents the task being dragged.
as Task: This is a TypeScript type assertion that 
tells the compiler, "I am certain that this data is a
Task object." This gives you type safety and
autocompletion for the task variable.
In short: This line extracts the complete Task 
object that was just moved.
*/




    // Leemos el nombre original de la columna desde el atributo 'data-column-name'
    // para asegurar que la lógica funcione correctamente, especialmente con SSR.
    const newColumn = event.container.element.nativeElement.getAttribute('data-column-name') as TaskColumns;
    /*
    event.container
    The event object is of type CdkDragDrop.
    The container property on this object refers to the
    cdkDropList container where the drag operation 
    ended.
    
    .element.nativeElement
     event.container.element is an Angular ElementRef,
     which is a wrapper around a native DOM element.
     .nativeElement unwraps it, giving you direct
     access to the actual HTML element in the DOM. In 
     this case, it's the <div> that represents the column.

    This is a standard JavaScript method to read the
     value of an attribute from an HTML element.
     It's looking for an attribute named data-column-
     name. You cleverly set this attribute in your HTML
      template (board.component.html):html
    <!-- in c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\app\components\board\board.component.html -->
  <div cdkDropList 
     [id]="..." 
     [attr.data-column-name]="column"  <!-- Here is where the attribute is set -->
     [cdkDropListData]="..." 
     class="task-list" 
     (cdkDropListDropped)="drop($event)">
  ...
</div>

getAttribute('data-column-name')
This is An atribute that is in html component 
of boardcomponent.html
*/

this.taskService.updateTask({ ...task, column: newColumn });
   /*
     { ...task, column: newColumn }  
   - This creates a brand new Javascript object,
   It takes the task object (which you identified in
   the previous line as the card that was dragged) and
   copies all of its properties (like id, title, 
   description, priority, etc.) into this new object.
   
   column: newColumn: This part then overwrites the
   column property in the new object. It sets the
   value of column to whatever is in the newColumn
   variable (which you identified as the name of the
   column where the card was dropped, e.g., 
   'In Progress')

   Result: You now have a complete Task object that
   is an exact copy of the original, but with its
   column status updated.

this.taskService.updateTask(...) (Calling the Service)
    
  */
  }


/*
The purpose of the openTaskDialog method is to open
a modal window (a dialog) that allows the user to 
either:

The purpose of the openTaskDialog method is to
open a modal window (a dialog) that allows the
 user to either:

Create a new task (if no task is provided to the
 method).
Edit an existing task (if a task object is passed
to the method).
It uses the TaskDialogComponent as the user
interface for this form.
*/

/*
The ? after task is what makes it optional.
You can call this method in two ways:
openTaskDialog() or openTaskDialog(someTaskObject).
Task: If you do provide the parameter,
 it must be an object that matches the 
 Task model.

this.dialog.open(...) (Opening the Dialog)
this.dialog: This refers to the instance of
Angular Material's MatDialog service that you
injected into the component. Its job is to manage
and open dialogs.
.open(): This is the primary method of the
MatDialog service. It takes two main arguments:
The component to display inside the dialog.
A configuration object to customize the dialog's 
appearance and behavior.

{
  width: '500px',
  data: task ? { ...task } : null,
}
width: '500px': This is straightforward styling. 
It sets the width of the dialog window to 500
 pixels.

data: task ? { ...task } : null: This is the most
important part for functionality.

data: This property is the standard way to pass
data from your BoardComponent into the
TaskDialogComponent.

The "if" part (task ?): It checks if the task 
object was provided when openTaskDialog was 
called.

The "then" part ({ ...task }): If task exists
(meaning we are editing), it creates a shallow 
copy of the task object using the spread syntax
(...). This is a critical best practice! It 
ensures that if the user edits the form and
then clicks "Cancel", the original task object
in your main board is not accidentally changed.
The changes are only saved if the user explicitly
confirms them.


*/

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? { ...task } : null,
    });
/*

Inside task-dialog.component.ts, the data you pass
here is received through dependency injection 
using the MAT_DIALOG_DATA token:

// In c:\Users\Alfrredo\Documents\Angular\TaskBoard\src\app\components\task-dialog\task-dialog.component.ts

export class TaskDialogComponent {
  // ...
  public data: Task | null = 
  inject(MAT_DIALOG_DATA); // Receives the data here!
  isEditMode = !!this.data; 
  / Becomes `true` if data is a task, `false` 
  if it's null
  // ...
}

*/
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }
/*
When you called this.dialog.open(...), it
returned an object called a MatDialogRef. 
Think of this dialogRef as a remote control
for the dialog you just opened. Your 
BoardComponent holds this remote control
and can use it to listen for events from the
dialog.

2. .afterClosed()
This is a method on the dialogRef "remote control".
It returns an Observable.
An Observable is a stream of data that you can
listen to. In this specific case, afterClosed()
creates a stream that will emit a value exactly
once, right after the dialog has been closed.
The value it emits is whatever was passed to the
close() method from inside the 
TaskDialogComponent.

So, the dialogRef in BoardComponent is a handle
that the parent (BoardComponent) uses to control
 or listen to the child (the dialog).

 You need to understand that dialogref its a comunicator 
 between board.component.ts and task-dialog.component.ts

 Now we pass to the next.
3. .subscribe(result => { ... })
This is how you "listen" to the Observable
stream from afterClosed().
.subscribe() attaches a callback function
that will execute whenever the stream emits
a value.
result: This is the name you've given to
the value that comes back from the stream.
Based on the code above, result will be 
true if the user saved, and undefined if they
canceled.

the part of subsribe

Excellent question! That .subscribe(result => ...)
part comes from a powerful library called RxJS
(Reactive Extensions for JavaScript), which is a
fundamental part of Angular for handling 
asynchronous events.

In summary
The first part dialogRef.afterClosed  is the observable
that promise to send you a value in the future.
In this specifiv case, it promises to send a value
exactly once. right after the dialog has been closed.

You pass a function to .subscribe(). This 
function is a callback that will automatically 
execute when the Observable finally sends its 
value.

result => { ... } - The Callback Function
This is the function you provided to .subscribe().
result: This is the name you've given to the value
that the afterClosed() stream sends. It's the data
that "arrives" from the stream.


In this.dialog.component.ts

onSave(): void {
  // ...
  this.dialogRef.close(true); // <-- This sends `true` back to the listener.
}

onCancel(): void {
  this.dialogRef.close(); // <-- This sends `undefined` back to the listener.





*/
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value ?? '');
  }
/*
The purpose of the onSearch method is to act as an event
handler. Whenever the user types something into the
search input field in your HTML, this method is called.

This method is connected to an input field in your
board.component.html template, likely with an (input)
event binding like this:

<input 
  type="text" 
  placeholder="Buscar por título..." 
  (input)="onSearch($event)"
>

3. const target = event.target as HTMLInputElement;
event.target: This property on the event object gives
you the specific HTML element that triggered the event.
In this case, it's the <input> field the user is typing
in.

HTMLInputElement
This is a TypeScript type assertion. The default 
type for event.target is very generic. By telling
TypeScript as HTMLInputElement, you are saying, 
"I am certain this is an HTML input element.
" This is crucial because it gives you access to 
input-specific properties, most importantly, 
the .value property.

4. this.searchText.set(target.value ?? '');
this.searchText: This refers to the writable signal
you defined earlier in your component: searchText = 
signal('');

target.value: This gets the current text inside 
the input field.

?? '': This is the nullish coalescing operator.
It's a modern safety check. It means "if target.value
is null or undefined, use an empty string '' instead."
This prevents potential errors.

It primarily prevents type errors and potential runtime
errors by guaranteeing that you always pass a valid
string to your signal.

if is null then use ''.

So far, the flow is: 
User types -> (input) event fires -> onSearch is called
-> searchText signal is updated.


*/


  onFilterByTag(tags: string[]): void {
    this.selectedTags.set(tags);
  }

/*
The purpose of the onFilterByTag method is to act as an
event handler. Whenever the user changes their selection
in the "Filtrar por etiqueta" (Filter by tag) dropdown,
this method is called. Its only job is to update the
selectedTags signal with the new array of selected tags.  

This method is connected to the <mat-select> dropdown
in your board.component.html template via the
(selectionChange) event binding: html
<!-- in c:\Users\Alfrredo\Documents\Angular\TaskBoard\
src\app\components\board\board.component.html -->
<mat-select (selectionChange)="onFilterByTag($event.value)"
multiple>
  ...
</mat-select>


(selectionChange): This is an event from Angular Material
that fires every time the user selects or deselects an
option in the dropdown.

onFilterByTag($event.value): This calls your method
and passes the new value of the selection. Because the
<mat-select> has the multiple attribute, $event.value
is an array of the currently selected tags (e.g., ['UI']
or ['Frontend', 'Angular'])

2. onFilterByTag(tags: string[]): void (The Method
Signature)

onFilterByTag(tags: string[]): void (The Method
Signature)
onFilterByTag: The name of the function.
tags: string[]: It accepts one argument, tags,
which is an array of strings. This array comes 
directly from the $event.value of the mat-select
component.
: void: This indicates the function doesn't return
a value. Its only purpose is to update the component's
state.

3. this.selectedTags.set(tags);
This is the single, powerful line that drives the
filtering reactivity.
this.selectedTags: This refers to the writable signal
you defined earlier in your component: selectedTags
= signal<string[]>([]);.
.set(tags): This is the method used to update the
value of a writable signal. It completely replaces
the old array of selected tags with the new tags array
that was passed into the method.

This creates a very clean and efficient data flow:
User changes tag selection -> onFilterByTag updates
the signal -> filteredTasks re-calculates -> The UI
updates automatically-


*/






}