import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    CdkTextareaAutosize,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode: boolean;
  priorities: Task['priority'][] = ['Low', 'Medium', 'High'];
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.isEditMode = !!this.data;
    this.tags = this.data?.tags ? [...this.data.tags] : [];
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      id: [this.data?.id],
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      priority: [this.data?.priority || 'Medium', Validators.required],
      assignedTo: [this.data?.assignedTo || ''],
      dueDate: [this.data?.dueDate],
      column: [this.data?.column || 'To Do'],
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSave(): void {
    if (this.taskForm.invalid) return;
    const taskData = { ...this.data, ...this.taskForm.value, tags: this.tags };
    this.isEditMode ? this.taskService.updateTask(taskData) : this.taskService.addTask(taskData);
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
