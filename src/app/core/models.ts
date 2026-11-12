export interface Project {
  id?: number;
  name: string;
}

export interface Task {
  id?: number;
  projectId: number;
  title: string;
  done: boolean;
  createdAt: number;
}
