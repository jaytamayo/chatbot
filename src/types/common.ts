export interface IModalProps<T> {
  showModal?(): void;
  hideModal(): void;
  visible?: boolean;
  loading?: boolean;
  onOk?(payload?: T): Promise<any> | void;
}

export interface ResponseGetType<T = any> {
  data: T;
  loading?: boolean;
}
