export interface ResponseEntrepreneur {
  name: string;
  phoneNumber: string;
  email: string;
  requiresEventInformation: boolean;
  address: string;
  isActive: boolean;
  neighborhood: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
}
