export interface ResponseInterface<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}
