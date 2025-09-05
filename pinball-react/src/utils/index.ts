// 曲线函数 (二次贝塞尔)
export function bezier(
  t: number,
  p0: any,
  p1: any,
  p2: any
): Phaser.Types.Math.Vector2Like {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}
