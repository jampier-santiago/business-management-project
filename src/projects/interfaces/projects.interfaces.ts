export interface ResponseProject {
  id: number;
  name: string;
  description: string;
  budget: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  requiresAccompaniment: boolean;
  entrepreneur: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
}
