export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
  roles: string;
  created_at?: string;
}

export interface UserCreate {
  id: number;
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
  roles: {id: number, name: string }[];
  created_at: string;
}
