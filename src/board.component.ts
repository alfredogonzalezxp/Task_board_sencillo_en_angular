import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from './task.model';
import { TaskService } from './task.service';
import { TaskCardComponent } from './task-card.component';
import { TaskDialogComponent } from './task-dialog.component';


type TaskColumns = 'To Do' | 'In Progress' | 'Done';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
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
  private dialog = inject(MatDialog);

  columns: TaskColumns[] = ['To Do', 'In Progress', 'Done'];
  tasks = signal<Task[]>([]);

  // Filtros
  searchText = signal('');
  selectedTags = signal<string[]>([]);

  allTags = computed(() => {
    const tags = new Set<string>();
    this.tasks().forEach(task => task.tags.forEach((tag: string) => tags.add(tag)));
    return Array.from(tags);
  });

  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const search = this.searchText().toLowerCase();
    const tags = this.selectedTags();

    const filtered = allTasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(search);
      const tagMatch = tags.length === 0 || tags.every(tag => task.tags.includes(tag));
      return titleMatch && tagMatch;
    });

    return this.groupTasksByColumn(filtered);
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks.set(this.taskService.getTasks());
  }

  groupTasksByColumn(tasks: Task[]): Record<TaskColumns, Task[]> {
    const grouped: Record<TaskColumns, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };

    tasks.forEach(task => {
      grouped[task.column as TaskColumns]?.push(task);
    });

    return grouped;
  }

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
    // Leemos el nombre original de la columna desde el atributo 'data-column-name'
    // para asegurar que la lógica funcione correctamente, especialmente con SSR.
    const newColumn = event.container.element.nativeElement.getAttribute('data-column-name') as TaskColumns;
    this.taskService.updateTask({ ...task, column: newColumn });
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? { ...task } : null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value ?? '');
  }

  onFilterByTag(tags: string[]): void {
    this.selectedTags.set(tags);
  }
}