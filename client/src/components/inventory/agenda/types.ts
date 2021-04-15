import { AgendaItem } from 'types';

export type AgendaItemUpdate = Pick<
  AgendaItem,
  'id' | 'content' | 'itemDate' | 'sortOrder'
>;

export interface AgendaItemProps {
  handleChange: (updates: AgendaItemUpdate[]) => void;
  handleRemoveItem: (id: number, sortOrder: number) => void;
  handleSave: (id: number, onComplete: () => void) => void;
  handleSortChange: (item: AgendaItemUpdate, direction: 'up' | 'down') => void;
  selectedWeekNumber: number;
  item: AgendaItemUpdate;
  isFirst: boolean;
  isLast: boolean;
  onCancel: (id: number) => void;
}
