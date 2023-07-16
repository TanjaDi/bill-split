import { Color } from './color.model';

export interface Person {
  id: string;
  name: string;
  initials: string | null;
  color: Color;
}
