// Interfaces
import { ResponseCity } from '../../cities/interfaces/cities.interfaces';

export interface ResponseNeighborhood {
  id: number;
  name: string;
  city: ResponseCity;
}
