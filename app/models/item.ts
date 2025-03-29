import { User } from './user';

export interface Item {
  user: User | null | undefined;
  category_id: number;
  unit_price: number;
  image_url: string;
  id: number;
  name: string;
  description: string;
  quantity: number;
}
