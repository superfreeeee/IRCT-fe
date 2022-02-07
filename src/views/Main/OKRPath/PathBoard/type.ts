import { BaseType } from 'd3';
import { MutableRefObject } from 'react';

import {
  OrganizationViewPointEntity,
  PersonalViewPointEntity,
} from '@views/Main/state/okrDB/type';

// ========== enum ==========
/**
 * 节点半径
 */
export enum NodeRadius {
  CenterUser = 39,
  SideUser = 29,
  ExtraUser = 10,
  O = 22,
  KR = 17,
  Project = 12,
  Todo = 7,
}

/**
 * 节点图片边缘
 */
export enum NodeImagePadding {
  L1 = 5,
  L2 = 3,
  L3 = 1,
}

/**
 * 节点图片遮罩透明度
 */
export enum NodeImageMaskOpacity {
  Inactive = 0.5,
  Hover = 0.2,
  Active = 0,
}

/**
 * 节点填充色
 */
export enum NodeColor {
  // 激活前颜色
  User = '#FFFFFF',
  O = '#F0FEFF',
  KR = '#F0FEFF',
  Project = '#F4F0FF',
  Todo = '#FFF8F3',

  // Hover 颜色
  HoverO = '#8DBBBE',
  HoverKR = '#8DBBBE',
  HoverProject = '#9485BF',
  HoverTodo = '#BC8D73',

  // Active 颜色
  ActiveO = '#CEFCFF',
  ActiveKR = '#CEFCFF',
  ActiveProject = '#C2ADFF',
  ActiveTodo = '#FCB993',
}

/**
 * 节点文字颜色
 */
export enum NodeTextColor {
  Inactive = '#BABABA',
  Active = '#FFFFFF',
}

/**
 * 节点文字大小
 */
export enum NodeTextSize {
  Hidden = 0,
  Default = 12,

  O = 16,
  KR = 10, // svg 好像可以突破 12px 限制
}

/**
 * Active 状态下描边宽度
 */
export enum NodeStrokeWidth {
  Inactive = 0,
  O = 5,
  KR = 4,
  Project = 3,
  Todo = 2,
}

/**
 * 节点状态
 */
export enum NodeState {
  Inactive = 'inactive',
  Hover = 'hover',
  Active = 'active',
  Additional = 'additional',
}

/**
 * 关系渐层色
 */
export enum LinkColor {
  Hidden = 'transparent',
  Inactive = '#FFFFFF',
  UserSide = '#FFFFFF',
  OSide = '#9CBDBF',
  KRSide = '#9CBDBF',
  ProjectSide = '#9485BF',
  TodoSide = '#BC8D73',

  AddtionalOO = '#8DBBBE',
}

/**
 * 关系颜色透明度
 */
export enum LinkColorOpacity {
  Inactive = 0.1,
  Active = 0.65,
}

/**
 * Node/Link 选中状态
 */
export enum SelectionType {
  Inactive = 'inactive',
  Hover = 'hover',
  Active = 'active',
}

/**
 * 根据鼠标手势控制颜色
 */
export enum MouseActionType {
  Enter = 'mouse_enter',
  Leave = 'mouse_leave',
  Click = 'mouse_click',
  Clear = 'mouse_clear',
}

// ========== data ==========
export interface PathNode extends d3.SimulationNodeDatum {
  id: string;
  data: OrganizationViewPointEntity | PersonalViewPointEntity;
  store: {
    // static init 初始化确定
    radius?: NodeRadius;
    color?: NodeColor;
    hoverColor?: NodeColor;
    activeColor?: NodeColor;
    imageWidth?: number;
    imagePadding?: NodeImagePadding;
    text?: string;
    fontSize?: number;
    strokeWidth?: NodeStrokeWidth;
    // node state 动态状态
    state: NodeState;
    additional?: boolean; // 非直接关联同 id 节点
  };
  draggable: boolean;
  seq?: number;
}

export interface PathLink extends d3.SimulationLinkDatum<PathNode> {
  store: {
    // static init 初始化确定
    id?: string;
    colorId?: string;
    activeColorStart?: LinkColor;
    activeColorEnd?: LinkColor;
    // update when tick
    x1?: number;
    y1?: number;
    angle?: number;
    scale?: number;
    // link state 动态状态
    active?: boolean;
  };
  additional: boolean;
  force: number;
}

export interface PathBoardSource {
  nodes: PathNode[];
  links: PathLink[];
}

// ========== selections ==========
type SimpleSelection<E extends BaseType> = d3.Selection<
  E,
  unknown,
  HTMLElement,
  any
>;

export type SVGSelection = SimpleSelection<SVGSVGElement>;
export type MaskSelection = SimpleSelection<SVGRectElement>;
export type RootSelection = SimpleSelection<SVGGElement>;

export type LinksSelection = d3.Selection<any, PathLink, any, any>;
export type NodesSelection = d3.Selection<any, PathNode, any, any>;
export type ImageSelection = d3.Selection<any, PathNode, any, any>;
export type TextSelection = d3.Selection<any, PathNode, any, any>;

export interface TickBindRefs {
  linksRef: MutableRefObject<LinksSelection>;
  nodesRef: MutableRefObject<NodesSelection>;
}

export type TransZoomBehavior = d3.ZoomBehavior<Element, any>;

export interface BoundNodeAction {
  (e: MouseEvent, targetNode: PathNode): void;
}

// ========== actions ==========
export interface NodeActionCallback {
  (node: PathNode, e?: MouseEvent): void;
}

export enum NodeDragType {
  Down = 'dragstart',
  Move = 'dragdrag',
  Up = 'dragend',
}

export interface NodeDragCallback {
  (type: NodeDragType, e: MouseEvent, targetNode: PathNode): void;
}

export interface ItemsRefObj {
  linksRef: MutableRefObject<LinksSelection>;
  nodesRef: MutableRefObject<NodesSelection>;
}
