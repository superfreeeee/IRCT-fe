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
 * 节点图片 padding
 */
export enum NodeImagePadding {
  L1 = 5,
  L2 = 3,
  L3 = 1,
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

  // 激活后颜色
  ActiveO = '#8DBBBE',
  ActiveKR = '#8DBBBE',
  ActiveProject = '#9485BF',
  ActiveTodo = '#BC8D73',
}

export enum NodeTextColor {
  Inactive = '#BABABA',
  Active = '#FFFFFF',
}

/**
 * 关系渐层色
 */
export enum LinkColor {
  Inactive = '#FFFFFF',
  UserSide = '#FFFFFF',
  OSide = '#9CBDBF',
  KRSide = '#9CBDBF',
  ProjectSide = '#9485BF',
  TodoSide = '#BC8D73',
}

/**
 * Node/Link 选中状态
 */
export enum SelectionType {
  Inactive = 'inactive',
  Hover = 'hover',
  Active = 'active',
}

// ========== data ==========
export interface PathNode extends d3.SimulationNodeDatum {
  id: string;
  data: OrganizationViewPointEntity | PersonalViewPointEntity;
  store: {
    // static init 初始化确定
    radius?: NodeRadius;
    color?: NodeColor;
    activeColor?: NodeColor;
    imageWidth?: number;
    imagePadding?: NodeImagePadding;
    text?: string;
    // node state 动态状态
    active?: boolean;
  };
  draggable: boolean;
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
