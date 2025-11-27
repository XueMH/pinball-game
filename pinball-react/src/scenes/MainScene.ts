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
