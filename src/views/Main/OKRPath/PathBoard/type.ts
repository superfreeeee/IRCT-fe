import { BaseType } from 'd3';

import {
  OrganizationViewPointEntity,
  PersonalViewPointEntity,
} from '@views/Main/state/okrDB/type';
import { MutableRefObject } from 'react';

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
  User = '#fff',
  O = '#f0feff',
  KR = '#f0feff',
  Project = '#f4f0ff',
  Todo = '#fff8f3',
}

// ========== data ==========
export interface PathNode extends d3.SimulationNodeDatum {
  id: string;
  data: OrganizationViewPointEntity | PersonalViewPointEntity;
  store: {
    // static init 初始化确定
    radius?: NodeRadius;
    color?: NodeColor;
    text?: string;
    imageWidth?: number;
    imagePadding?: NodeImagePadding;
  };
  draggable: boolean;
}

export interface PathLink extends d3.SimulationLinkDatum<PathNode> {
  store: {
    // static init 初始化确定
    color?: string;
    activeColor?: string;
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
