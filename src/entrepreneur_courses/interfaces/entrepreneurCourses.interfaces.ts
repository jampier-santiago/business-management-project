export interface ResponseEntrepreneurCourse {
  id: number;
  assignedAt: Date;
  completedAt?: Date;
  entrepreneur: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
  status: string;
}
