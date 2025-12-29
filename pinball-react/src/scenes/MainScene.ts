import Phaser from 'phaser';
import { InputController } from './InputController';
import { PlayGround } from './PlayGround';
import { debounce } from 'lodash';

export class MainScene extends Phaser.Scene {
  private allBodies!: {
    bound: Phaser.Physics.Matter.World;
    ball: MatterJS.BodyType;
    slope_bottom: MatterJS.BodyType;
    launch_pad: MatterJS.BodyType;
    interceptor: MatterJS.BodyType;
    exit_sensors: MatterJS.BodyType[];
  };
  launch_ready!: boolean;

  private inputController!: InputController;

  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    const MatterBody = this.matter.body;

    // 监听发射台准备就绪事件
    window.bus.on('LaunchReady', (status: boolean) => {
      if (status) {
        this.setReady();
      } else {
        this.launch_ready = false;
      }
    });

    // 初始化游戏场地和小球
    this.allBodies = new PlayGround(this).init();

    // 初始化输入控制器
    this.inputController = new InputController(this);

    // 游戏场景创建完成
    window.bus.emit('MainSceneCreated');

    // 监听开始游戏事件
    window.bus.on('StartGame', (data: { multiplier: number; winExits: number }) => {
      // console.log('开始游戏，倍数：', data.multiplier, '赢球出口数量：', data.winExits);

      // 暂时只记录事件 - 实际的游戏开始逻辑将在这里实现
      this.matter.body.set(this.allBodies.interceptor, { isSensor: true });
      setTimeout(() => {
        // 给小球一个向左的速度，让小球滚向拦截器
        this.matter.body.setVelocity(this.allBodies.ball, { x: -0.5, y: -1 });
      });

      setTimeout(() => {
        this.matter.body.set(this.allBodies.interceptor, { isSensor: false });
      }, 3000);
      // 倍数和赢球出口可用于确定获胜条件
    });
  }

  launchBall(force: number) {
    // 给球施加一个向上的力
    this.matter.body.setVelocity(this.allBodies.ball, { x: 0, y: -force });
  }

  private setReady = debounce(() => {
    console.log('小球在发射台上，准备发射');
    this.launch_ready = true;
  }, 1000);

  update() {}

  getAllBodies() {
    return { ...this.allBodies };
  }
}
