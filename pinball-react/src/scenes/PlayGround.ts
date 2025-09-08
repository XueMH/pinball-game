import { MainScene } from "./MainScene";
import { bezier } from "@/utils";
import { debounce } from "lodash";

export class PlayGround {
  private mainScene: MainScene;
  private bound: Phaser.Physics.Matter.World | undefined;
  private ball: MatterJS.BodyType | undefined;
  private slope_bottom: MatterJS.BodyType | undefined;
  private launch_pad: MatterJS.BodyType | undefined;

  constructor(scene: MainScene) {
    this.mainScene = scene;
  }

  init() {
    const { width, height } = this.mainScene.sys.game.canvas;

    const MatterBody = this.mainScene.matter.body;

    /********************************* 🔲🔲🔲创建场地边界 *********************************/
    // 🔲🔲🔲创建场地边界
    const bound = this.mainScene.matter.world.setBounds(
      0,
      0, // 场地左上角
      width,
      height, // 场地尺寸
      100, // 墙体厚度
      true,
      true,
      true,
      true // 是否创建 左/右/上/下 墙
    );
    this.bound = bound;
    // 外墙圆角半径
    const bound_radius = 150;
    const bound_curve_offset = 31;
    // const bound_radius = 120;
    // const bound_curve_offset = 26;
    // 曲线上的点的数量
    const segments = 100;
    // ↖️↖️↖️左上角曲线
    const top_left = {
      p0: { x: 0, y: bound_radius },
      p1: { x: 0, y: 0 },
      p2: { x: bound_radius, y: 0 },
    };
    const points_top_left: any[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points_top_left.push(bezier(t, top_left.p0, top_left.p1, top_left.p2));
    }
    points_top_left.push({ x: 0, y: 0 });
    const curve_top_left = this.mainScene.matter.add.fromVertices(
      bound_curve_offset,
      bound_curve_offset,
      points_top_left,
      {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }
    );

    // ↗️↗️↗️右上角曲线
    const top_right = {
      p0: { x: width - bound_radius, y: 0 },
      p1: { x: width, y: 0 },
      p2: { x: width, y: bound_radius },
    };
    const points_top_right: any[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points_top_right.push(
        bezier(t, top_right.p0, top_right.p1, top_right.p2)
      );
    }
    points_top_right.push({ x: width, y: 0 });
    const curve_top_right = this.mainScene.matter.add.fromVertices(
      width - bound_curve_offset,
      bound_curve_offset,
      points_top_right,
      {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }
    );
    /********************************* 🔲🔲🔲创建场地边界 *********************************/
    /********************************* ⏸️⏸️⏸️创建轨道墙 *********************************/
    // 创建轨道墙
    const track_wall_height = height - 100 - bound_radius;
    const track_wall_height_offset = height / 2 + (bound_radius - 100) / 2;
    const track_wall = this.mainScene.matter.add.rectangle(
      width - 52,
      track_wall_height_offset,
      20,
      track_wall_height,
      {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }
    );
    const track_wall_curve_points_static = {
      p0: {
        x: width - 42,
        y: bound_radius,
      },
      p1: { x: width - 42, y: 42 },
      p2: { x: width - 150, y: 60 },
    };
    const points_track_wall_curve: any[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points_track_wall_curve.push(
        bezier(
          t,
          track_wall_curve_points_static.p0,
          track_wall_curve_points_static.p1,
          track_wall_curve_points_static.p2
        )
      );
    }
    points_track_wall_curve.push({ x: width - 62, y: bound_radius });
    // 创建轨道墙上方曲线墙
    const track_wall_curve = this.mainScene.matter.add.fromVertices(
      width - 85.5,
      97,
      points_track_wall_curve,
      {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }
    );
    /********************************* ⏸️⏸️⏸️创建轨道墙 *********************************/
    /********************************** 📌📌📌创建反弹柱子 **********************************/
    /** 粗柱子曲线参数1 */
    const thick_pillar_curve_points_1 = {
      p0: { x: 66, y: 200 },
      p1: { x: (width - 62) / 2, y: 160 },
      p2: { x: width - 128, y: 200 },
    };
    /** 粗柱子曲线参数2 */
    const thick_pillar_curve_points_2 = {
      p0: { x: 120, y: 280 },
      p1: { x: (width - 62) / 2, y: 280 },
      p2: { x: width - 182, y: 280 },
    };
    /** 粗柱子曲线参数3 */
    const thick_pillar_curve_points_3 = {
      p0: { x: 66, y: 360 },
      p1: { x: (width - 42) / 2, y: 400 },
      p2: { x: width - 128, y: 360 },
    };
    /** 细柱子曲线参数1 */
    const thin_pillar_curve_points_1 = {
      p0: { x: 75, y: 460 },
      p1: { x: (width - 62) / 2, y: 480 },
      p2: { x: width - 137, y: 460 },
    };
    /** 细柱子曲线参数2 */
    const thin_pillar_curve_points_2 = {
      p0: { x: 55, y: 550 },
      p1: { x: (width - 62) / 2, y: 560 },
      p2: { x: width - 117, y: 550 },
    };
    /** 细柱子曲线参数3 */
    const thin_pillar_curve_points_3 = {
      p0: { x: 75, y: 640 },
      p1: { x: (width - 62) / 2, y: 640 },
      p2: { x: width - 137, y: 640 },
    };
    /** 细柱子曲线参数4 */
    const thin_pillar_curve_points_4 = {
      p0: { x: 55, y: 720 },
      p1: { x: (width - 62) / 2, y: 720 },
      p2: { x: width - 117, y: 720 },
    };

    const thick_pillar_positions_1 = []; // 粗柱子位置点1
    const thick_pillar_positions_2 = []; // 粗柱子位置点2
    const thick_pillar_positions_3 = []; // 粗柱子位置点3
    const thin_pillar_positions_1 = []; // 细柱子位置点1
    const thin_pillar_positions_2 = []; // 细柱子位置点2
    const thin_pillar_positions_3 = []; // 细柱子位置点3
    const thin_pillar_positions_4 = []; // 细柱子位置点4

    // 粗主子数量
    const thick_pillar_count = 8;
    // 细柱子数量
    const thin_pillar_count = 11;

    for (let i = 0; i < thick_pillar_count; i++) {
      thick_pillar_positions_1.push(
        bezier(
          i / (thick_pillar_count - 1),
          thick_pillar_curve_points_1.p0,
          thick_pillar_curve_points_1.p1,
          thick_pillar_curve_points_1.p2
        )
      );
      thick_pillar_positions_3.push(
        bezier(
          i / (thick_pillar_count - 1),
          thick_pillar_curve_points_3.p0,
          thick_pillar_curve_points_3.p1,
          thick_pillar_curve_points_3.p2
        )
      );
    }
    for (let i = 0; i < thick_pillar_count - 1; i++) {
      thick_pillar_positions_2.push(
        bezier(
          i / (thick_pillar_count - 2),
          thick_pillar_curve_points_2.p0,
          thick_pillar_curve_points_2.p1,
          thick_pillar_curve_points_2.p2
        )
      );
    }
    for (let i = 0; i < thin_pillar_count - 1; i++) {
      thin_pillar_positions_1.push(
        bezier(
          i / (thin_pillar_count - 2),
          thin_pillar_curve_points_1.p0,
          thin_pillar_curve_points_1.p1,
          thin_pillar_curve_points_1.p2
        )
      );
      thin_pillar_positions_3.push(
        bezier(
          i / (thin_pillar_count - 2),
          thin_pillar_curve_points_3.p0,
          thin_pillar_curve_points_3.p1,
          thin_pillar_curve_points_3.p2
        )
      );
    }
    for (let i = 0; i < thin_pillar_count; i++) {
      thin_pillar_positions_2.push(
        bezier(
          i / (thin_pillar_count - 1),
          thin_pillar_curve_points_2.p0,
          thin_pillar_curve_points_2.p1,
          thin_pillar_curve_points_2.p2
        )
      );
      thin_pillar_positions_4.push(
        bezier(
          i / (thin_pillar_count - 1),
          thin_pillar_curve_points_4.p0,
          thin_pillar_curve_points_4.p1,
          thin_pillar_curve_points_4.p2
        )
      );
    }

    // 粗主子粗细
    const thick_pillar_radius = 16;
    // 细柱子粗细
    const thin_pillar_radius = 8;

    // 创建粗柱子1
    thick_pillar_positions_1.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thick_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建粗柱子2
    thick_pillar_positions_2.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thick_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建粗柱子3
    thick_pillar_positions_3.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thick_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建细柱子1
    thin_pillar_positions_1.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thin_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建细柱子2
    thin_pillar_positions_2.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thin_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建细柱子3
    thin_pillar_positions_3.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thin_pillar_radius, {
        isStatic: true,
      });
    });
    // 创建细柱子4
    thin_pillar_positions_4.forEach(({ x, y }) => {
      this.mainScene.matter.add.circle(x, y, thin_pillar_radius, {
        isStatic: true,
      });
    });
    // {
    //   p0: { x: 60, y: 280 },
    //   p1: { x: (width - 42) / 2, y: 300 },
    //   p2: { x: width - 122, y: 280 },
    // },

    /********************************** 📌📌📌创建反弹柱子 **********************************/
    /********************************** 🚧🚧🚧边界引导障碍物 *******************************/
    
    /********************************** 🚧🚧🚧边界引导障碍物 *******************************/
    /*********************************** 🔴🔴🔴小球 ***********************************/
    const main_ball = this.mainScene.matter.add.circle(
      width - 100,
      height - 80,
      20,
      {
        label: "main_ball",
        restitution: 0.8,
        friction: 0,
        frictionAir: 0.002,
        timeScale: 0.5,
      }
    );
    this.ball = main_ball;
    /*********************************** 🔴🔴🔴小球 ***********************************/
    /********************************* 📉📉📉创建底部斜坡 *********************************/
    // 创建底部斜坡
    const slope_bottom = this.mainScene.matter.add.trapezoid(
      width / 2 - 63,
      height - 37,
      0,
      0,
      0,
      {
        label: "slope_bottom",
        isStatic: true,
        restitution: 0,
        friction: 0.01,
        vertices: [
          { x: 0, y: height - 100 },
          { x: width - 42, y: height - 50 },
          { x: width - 42, y: height },
          { x: 0, y: height },
        ],
        onCollideCallback() {
          console.log("小球碰撞到斜坡，滚回发射台");
          MatterBody.setVelocity(main_ball, { x: 5.0, y: 0.5 });
        },
      }
    );
    this.slope_bottom = slope_bottom;
    /********************************* 📉📉📉创建底部斜坡 *********************************/

    /********************************* 🚀🚀🚀创建发射台 *********************************/
    const launch_pad_points = [
      { x: width - 42, y: height },
      { x: width - 42, y: height - 48 },
      { x: width - 21, y: height - 20 },
      { x: width, y: height - 48 },
      { x: width, y: height },
      { x: width - 42, y: height },
    ];
    const launch_pad = this.mainScene.matter.add.fromVertices(
      width - 21,
      height - 18,
      launch_pad_points,
      {
        isStatic: true,
        restitution: 0,
        friction: 1,
        onCollideCallback() {
          MatterBody.setVelocity(main_ball, { x: 0.2, y: 0.2 });
          console.log("小球碰撞到发射台");
          window.bus.emit("LaunchReady", true);
        },
        onCollideEndCallback: () => {
          console.log("小球离开发射台");
          window.bus.emit("LaunchReady", false);
        },
      }
    );
    this.launch_pad = launch_pad;
    /********************************* 🚀🚀🚀创建发射台 *********************************/

    return {
      bound: this.bound,
      ball: this.ball,
      launch_pad: this.launch_pad,
      slope_bottom: this.slope_bottom,
    };
  }
}
