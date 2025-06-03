export interface ResponseIntern {
  id: number;
  semester: number;
  is_active: boolean;
  start_date: Date;
  end_date: Date;
  major: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    lastName: string;
  };
}
