import { BoxIconType } from '@components/BoxIcon';
import { EntityNode } from '../state/okrDB/type';

export type PathListSource = EntityNode;

export interface ContextMenuOption {
  iconUrl?: string;
  iconType?: BoxIconType;
  title: string;
  onClick: () => void;
}
