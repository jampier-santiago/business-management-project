export interface ResponseProjectIntern {
  id: number;
  project: {
    id: number;
    name: string;
  };
  intern: {
    id: number;
    name: string;
    lastName: string;
    major: {
      id: number;
      name: string;
    };
    semester: number;
  };
}
