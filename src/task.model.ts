export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  dueDate?: Date;
  assignedTo?: string;
  column: 'To Do' | 'In Progress' | 'Done';
}