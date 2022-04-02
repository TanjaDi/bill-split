import { Color } from './color.model';

export interface Friend {
  id: string;
  name: string;
  initials: string | null;
  color: Color;
}
