export const SIMULATION_AREA_SHRINK = true; // 可拖动面板是否缩放至当前面板大小

// 模拟空间声音扩散范围
export const SIMULATION_FIGURE_SIZE = 36;
export const SIMULATION_FIGURE_SIZE_INNER = 24;
export const SIMULATION_FIGURE_SIZE_OUTER = 26;

// level1: 内圈贴内圈
export const FIGURE_DISTANCE_LEVEL1 =
  (SIMULATION_FIGURE_SIZE + SIMULATION_FIGURE_SIZE_INNER * 2) ** 2;
// level2: 内圈贴外圈
export const FIGURE_DISTANCE_LEVEL2 =
  (SIMULATION_FIGURE_SIZE +
    SIMULATION_FIGURE_SIZE_INNER * 2 +
    SIMULATION_FIGURE_SIZE_OUTER) **
  2;
// level3: 外圈贴外圈
export const FIGURE_DISTANCE_LEVEL3 =
  (SIMULATION_FIGURE_SIZE +
    (SIMULATION_FIGURE_SIZE_INNER + SIMULATION_FIGURE_SIZE_OUTER) * 2) **
  2;
