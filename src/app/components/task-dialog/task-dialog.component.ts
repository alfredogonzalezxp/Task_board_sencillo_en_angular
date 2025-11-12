import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { Task } from 'task.model';
import { TaskService } from 'task.service';
/*
Of course! That block of code is the imports section
for your TaskDialogComponent. Its purpose is to bring
in all the necessary building blocks (modules, components,
services, etc.) from Angular's libraries and your own
files so that the component can function correctly.
Let's go through it group by group.
Angular Core and Common Imports
typescript
import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
@angular/core: This is the heart of the Angular framework.
Component: A decorator that marks a class as an Angular 
component and provides its metadata (like its selector, 
template, and styles).
Inject, inject: These are used for Dependency Injection.
inject is the modern, function-based way to get services
(like NonNullableFormBuilder), while @Inject(MAT_DIALOG_DATA)
is the decorator-based way used to get the data passed into the dialog.
@angular/common:
CommonModule: Provides common Angular directives like 
*ngIf (@if), *ngFor (@for), and *ngClass. You need this
for the @if and @for blocks in your template.
Angular Forms Imports
typescript
import { FormBuilder, FormGroup, Validators,
ReactiveFormsModule, NonNullableFormBuilder } from
'@angular/forms';
This group brings in everything needed for Reactive Forms,
which you use to manage the task creation/editing form.

ReactiveFormsModule: The module that enables the use of
reactive form directives in your template, such as [formGroup]
and formControlName.
FormGroup: The class that represents the main form.
It's a collection of individual form controls.
NonNullableFormBuilder: A stricter, more type-safe
version of FormBuilder. It helps you create FormGroup
instances, ensuring that the form controls cannot be
null unless you explicitly define them that way.
Validators: A collection of built-in functions for form
validation, like Validators.required.
Angular Material Imports
This is the largest group, as your dialog's UI is built
almost entirely with Angular Material components.

typescript
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA }
from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from
'@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
@angular/material/dialog:
MatDialogModule: Provides all the 
dialog-related components and services.
MatDialogRef: A reference to the dialog that is currently open.
Your component uses this to close() itself.
MAT_DIALOG_DATA: A special token used to inject the data
that was passed from the BoardComponent when the dialog
was opened.
@angular/material/form-field: Provides the <mat-form-field>
component, which wraps form inputs to give them the standard
Material Design styling (label, underline, hints, errors).
@angular/material/input: Provides the matInput directive,
which is applied to native <input> and <textarea> elements
to make them work correctly inside a <mat-form-field>.
@angular/material/select: Provides the <mat-select>
component for the "Priority" dropdown.
@angular/material/datepicker: Provides the date picker
functionality for the "Due Date" field.
@angular/material/button: Provides the mat-button and
mat-flat-button directives for the "Cancel" and "Save" buttons.
@angular/material/chips:
MatChipsModule: Provides the components for the tag input
field (<mat-chip-grid>, <mat-chip-row>).
MatChipInputEvent: The specific event type for the
(matChipInputTokenEnd) event, used when adding a new tag.
@angular/material/icon: Provides the <mat-icon> component,
used for the "cancel" icon on the tags.
@angular/material/core:
provideNativeDateAdapter: A required provider function that
tells the MatDatepicker how to work with native JavaScript
Date objects.
@angular/cdk/text-field:
CdkTextareaAutosize: A very useful directive from the
Component Dev Kit (CDK) that automatically resizes the
<textarea> for the description as the user types.
Local Application Imports
typescript
import { Task } from 'task.model';
import { TaskService } from 'task.service';
These are imports from your own project files.

Task: Imports the Task interface from your model file.
This provides a clear data structure and type-checking for
what a task object looks like.
TaskService: Imports your TaskService, which is responsible
for all the logic of adding, updating, and retrieving tasks 
from localStorage.
*/





@Component({
  selector: 'app-task-dialog', // Defines the custom HTML tag for
//This component.  If you wanted to use it component inside 
// another compoonent  tempplate  (which you don't in this case, as it's a dialog),
//  g you would write <app-task-dialog></app-task-dialog>.
  standalone: true, 
  //means this component is self-contained and manages its own
  //dependencies directly.

  imports: [
    CommonModule,
    /*
CommonModule: Provides basic Angular template features,
most importantly the control flow blocks like @if and @for.
You use this for showing error messages and looping through
priorities and tag
    */
    ReactiveFormsModule,
/*
ReactiveFormsModule: Essential for using reactive forms.
It provides the directives [formGroup] and formControlName
that you use to link your HTML form to the taskForm
FormGroup in your TypeScript code.
*/

    MatDialogModule,
/*
MatInputModule: Provides the matInput directive, which is
 necessary for native <input> and <textarea> elements to work
  correctly inside a <mat-form-field>.

  
*/
  
    MatFormFieldModule,
/*
Provides the <mat-form-field> component, which wraps your inputs
to give them the standard Material Design look with labels, underlines,
 and error messages.
 */



    MatInputModule,
  /*
   Provides the matInput directive, which is necessary
   for native <input> and <textarea> elements to work
   correctly inside a <mat-form-field>. 
  */
  
    MatSelectModule,
/*
Provides the <mat-select> component used for the "Priority"
dropdown menu.
*/  
    MatDatepickerModule,
    /*
    Provides all the components and directives for the date
    picker, including <mat-datepicker>, <mat-datepicker-toggle>,
    and the logic to connect them to an input.    
    */
    MatButtonModule,
    /*
     Provides the mat-button and mat-flat-button directives
     used for the "Cancel" and "Save" buttons.
     */

    MatChipsModule,
    /*
    Provides the components for the tag input field, like
    <mat-chip-grid>, <mat-chip-row>, and the matChipInputFor
    directive. 
    */
    MatIconModule,
/*
Provides the <mat-icon> component, which you use for the
"cancel" icon on each tag chip.
*/
    CdkTextareaAutosize,
/*
CdkTextareaAutosize: A directive from the Angular Component
Dev Kit (CDK) that you apply to the description <textarea>
to make it automatically resize as the user types
*/
  ],

  providers: [provideNativeDateAdapter()],
  /*
  Purpose: Angular Material's Datepicker (MatDatepickerModule)
  needs to know how to work with dates. By default, it's very
  flexible and can work with various date formats and 
  libraries (like Moment.js, Luxon, or native JavaScript
  Date objects).
  */
  templateUrl: './task-dialog.component.html',
  /*
  templateUrl Property: This property tells Angular where
  to find the HTML template for this component.
  Purpose: It points to the file (./task-dialog.component.html)
  that contains the structure and layout of your dialog's user
  interface. This HTML file will contain all the Angular Material
  form fields, buttons, and other elements that make up your
  task creation/editing form.
  
  */
  styleUrls: ['./task-dialog.component.scss'],
})

export class TaskDialogComponent {
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private taskService: TaskService = inject(TaskService);
/*
TaskService: This is the service you created to handle all
data operations for tasks—saving them to localStorage, 
updating them, adding new ones, etc.
*/
  public dialogRef: MatDialogRef<TaskDialogComponent> = inject(MatDialogRef);
/*
This injects a reference to the dialog window that this
component is currently displayed inside.

This generic type tells TypeScript that this is a reference
to a dialog that contains an instance of TaskDialogComponent.

public dialogRef: The reference is stored in a public
property. The most important reason for this is so you can
call this.dialogRef.close() from your onSave and onCancel
methods.
*/


  public data: Task | null = inject(MAT_DIALOG_DATA);
//MatDialog: The service you inject to open modal dialogs.
//You use it to open the TaskDialogComponent. in

/*
openTaskDialog(task?: Task): void {
  const dialogRef = this.dialog.open(TaskDialogComponent, { // 1. Call the delivery service
    width: '500px',
    // 2. Give the service the package (the data)
    data: task ? { ...task } : null, 
  });
  // ...
}
*/

/*
 This block of code is the heart of your TaskDialogComponent.
 It uses Angular's Dependency Injection system to get all 
 the tools and data the component needs to do its job.

It sees inject(MAT_DIALOG_DATA) and knows that this is a 
request for the value that was provided in the data property
back in BoardComponent

In short, injecting data from BoardComponent is the
communication channel that tells the TaskDialogComponent
what its initial state should be. The MatDialog service
acts as the intermediary, using the MAT_DIALOG_DATA token 
as the "address" for the data.
*/


  isEditMode = !!this.data;
  priorities: Task['priority'][] = ['Low', 'Medium', 'High'];
  tags: string[] = this.data?.tags ? [...this.data.tags] : [];
    /*
  Result: The isEditMode property will be true if you are
  editing a task and false if you are creating one. 
  This boolean is used in your template to dynamically
  change text, like showing "Editar Tarea" vs. "Nueva Tarea".
  
  If this.data is a Task object (a "truthy" value), 
  !this.data becomes false, and !!this.data becomes true
  If this.data is null (a "falsy" value), !this.data becomes
  true, and !!this.data becomes false.  
  priorities: ...: This declares a class property named
  priorities.
  Task['priority'][]: This is an advanced TypeScript
  type that makes your code very safe.
  Task['priority'] looks up the priority property on
  your Task interface and gets its type, which is 'Low'
   | 'Medium' | 'High'.
  The [] at the end makes it an array of that type. So, 
  the full type is ('Low' | 'Medium' | 'High')[].
  = ['Low', 'Medium', 'High']: This initializes the priorities
  array with the allowed string values.

Tags So, this part just declares a variable named tags that
 will store a list of text labels.

 If you're editing a task, this.data will be a Task object
 (e.g., { id: '1', title: '...', tags: ['UI', 'Design'], ... }).
If you're creating a new task, this.data will be null.

Without ?.: If this.data were null and you tried to do
this.data.tags, your application would crash with an error
like "Cannot read properties of null (reading 'tags')".

With ?.: this.data?.tags means: "If this.data is not null
or undefined, then try to access its tags property. 
Otherwise, just stop here and return undefined."

So, this.data?.tags will either give you the tags
 array from the task (if this.data is a task) or 
 undefined (if this.data is null). This prevents 
 your code from crashing if no task data was provided.

If this.data?.tags results in an actual array of tags
(a "truthy" value), the part after the ? is used.
If this.data?.tags results in undefined (a "falsy" 
value, which happens if this.data was null), the part 
after the : is used.

The line tags: string[] = this.data?.tags ? [...this.data.tags]
: []; effectively means:
"Declare a property called tags that will hold an array of
strings. If there is task data provided to this dialog
 (this.data is not null) AND that task data has a tags 
 property, then initialize tags with a copy of those tags. 
 Otherwise (if no task data was provided, or it didn't have
  tags), initialize tags as an empty array."

1. Safely check if there are existing tags.
2. If there are, make a safe copy to work on.
*/

  taskForm: FormGroup = this.fb.group({
    id: [this.data?.id ?? null],
// if this.data is NOT null or udefined(this meaning is a task
//object) so, the id is evaluate examle "12345", but if is unll
// its stablished the null value
    title: [this.data?.title ?? '', Validators.required],
    description: [this.data?.description ?? ''],
    priority: [this.data?.priority ?? 'Medium', Validators.required],
    assignedTo: [this.data?.assignedTo ?? ''],
    dueDate: [this.data?.dueDate ?? null],
    column: [this.data?.column ?? 'To Do'],
  });
/*
this.fb.group({ ... })
this.fb: This is the instance of NonNullableFormBuilder
that you injected earlier. It's a tool that helps you build
forms.
.group({ ... }): This method creates a FormGroup. The object
you pass inside the curly braces {} defines all the individual
input fields (called FormControls) that make up your form.
*/


  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    // Limpiar el input de forma segura
    if (event.chipInput) {
    /*
    The MatChipInputEvent object conveniently provides
    a reference to the input directive itself.
    .clear(): This is a method on the matChipInput 
    directive that clears the text from the <input> element.
    */
      event.chipInput.clear();
    }
  }
/*
 The purpose of the addTag method is to take the text
  a user has typed into the "Nueva etiqueta..."
 (New tag...) input, validate it, and if it's a valid 
 new tag, add it to the task's list of tags.

<html>
<input placeholder="Nueva etiqueta..."
       [matChipInputFor]="chipGrid"
       (matChipInputTokenEnd)="addTag($event)">  

       (matChipInputTokenEnd): This is a special event from Angular Material's

    addTag($event): When the event fires, it calls your
    addTag method and passes a special MatChipInputEvent
    object, which contains the value the user typed.

  event.value: This is the raw text from the input field
  (e.g., " Design "). || '': This is a safety check. 
  If for some reason event.value is null or undefined, 
  it uses an empty string '' instead. This prevents the 
  next part (.trim()) from causing an error.

This if statement performs two crucial validations
before adding the tag.
value: This first part checks if the value is "truthy".
An empty string ('') is "falsy", so this check effectively
means "Is the tag not empty?". This prevents users from 
adding blank tags.
!this.tags.includes(value): This second part checks
if the tags array (the list of tags already on the task)
does not already include the new value. This is what 
prevents duplicate tags. If the user tries to add "UI" 
when "UI" is already a tag, this condition will be false, 
and the code inside the if block will not run.

.push(value): This is the standard JavaScript array
method to add the new, validated value to the end of
the tags array.
Reactivity: Because your HTML template uses an 
@for loop to display chips from this tags array,
Angular automatically detects the change and renders
a new chip on the screen.


*/

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

/*
@for (tag of tags; track tag) {
  <mat-chip-row (removed)="removeTag(tag)">
    {{tag}}
    <button matChipRemove [attr.aria-label]="'remover ' + tag">
      <mat-icon>cancel</mat-icon>
    </button>
  </mat-chip-row>

this.tags: This refers to the local array in your
component that holds the current list of tags for the
task. .indexOf(tag): This is a standard JavaScript array
 method. It searches the tags array for the tag string
 that was passed into the function. Result: If the tag is
 found, indexOf returns its position (a zero-based index,
 like 0, 1, 2, etc.). If the tag is not found in the array,
 it returns -1.

 if (index > -1)
This is a crucial safety check. It ensures that the
 code inside the if block only runs if the tag was
 actually found in the array. If indexOf returned -1, 
 this condition would be false, and nothing would happen, 
 preventing potential errors.

4. this.tags.splice(index, 1);
This is the line that does the actual removal.
.splice(): This is a standard JavaScript array method
that changes the contents of an array by removing or 
replacing existing elements.
index: The first argument is the starting position for
the removal.
1: The second argument is the number of elements to remove.

So, this.tags.splice(index, 1) means: "Go to the tags
array, find the element at position index, and remove
exactly 1 element."

Because your HTML template uses an @for loop to render
the chips based on the tags array, Angular's change
detection automatically sees that an item has been
removed from the array. It then immediately updates
the UI to remove the corresponding chip from the screen.
*/

  onSave(): void {
    if (this.taskForm.invalid) return;
    /*
    "If the form is currently invalid (for example, 
    because the required title field is empty), then stop
    everything and do not proceed any further with the save
    operation."    
    */
    const taskData: Task = { ...this.data, ...this.taskForm.getRawValue(), tags: this.tags };
/*
Step 1: The Base Layer (...this.data) The new taskData object starts as a copy of the original task data. This is crucial for keeping the original id.

javascript
// After `...this.data`
taskData = { 
  id: '1', 
  title: 'Old Title', 
  column: 'To Do', 
  tags: ['Old Tag'] 
};

Step 2: The Form Updates (...this.taskForm.getRawValue()) Now,
the properties from the form are spread on top. If a
property already exists, it gets overwritten.

javascript
// After `...this.taskForm.getRawValue()`
taskData = { 
  id: '1', 
  title: 'New Title', // <-- Overwritten
  description: 'New Desc', // <-- Added
  column: 'In Progress', // <-- Overwritten
  tags: ['Old Tag'] 
};

Step 3: The Tags Update (tags: this.tags) Finally,
the tags property is explicitly set, overwriting the
tags that came from this.data.

javascript
// After `tags: this.tags`
taskData = { 
  id: '1', 
  title: 'New Title',
  description: 'New Desc',
  column: 'In Progress',
  tags: ['New Tag 1', 'New Tag 2'] // <-- Overwritten
};






*/

this.isEditMode ? this.taskService.updateTask(taskData) : this.taskService.addTask(taskData);

this.dialogRef.close(true);
    /*
this.dialogRef
This is a reference to the dialog window itself. Think of
it as a "remote control" for the dialog that this
component is currently living inside.
You get this reference at the top of your component
class via dependency injection:
typescript
public dialogRef: MatDialogRef<TaskDialogComponent> 
= inject(MatDialogRef)

*/
  }
  onCancel(): void {
    this.dialogRef.close();
  }
/*
<mat-dialog-actions align="end">
<button mat-button (click)="onCancel()">Cancelar</button>
</mat-dialog-actions>

this.dialogRef:
This is the reference to the dialog window itself,
which you get via dependency injection. Think of it 
as the "remote control" for the dialog this component
is inside.

.close():
This is the method on the dialogRef that closes the
dialog window.
Crucially, it's called with no arguments. 
When you call .close() without passing a value, 
the result that gets sent back to the component 
that opened the dialog is undefined.
*/



}
