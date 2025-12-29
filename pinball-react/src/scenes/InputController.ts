import { MainScene } from './MainScene';
import { throttle } from 'lodash';

export class InputController {
  private mainScene: MainScene;
  force: number = 5;

  constructor(scene: MainScene) {
    this.mainScene = scene;
    this.keyboardListener();
    this.initEventListeners();
  }

  private keyboardListener() {
    // 监听输入
    this.mainScene?.input?.keyboard?.on('keydown-SPACE', this.buildUpEnergy());
    this.mainScene?.input?.keyboard?.on('keyup-SPACE', () => {
      this.launchBall();
    });
  }

  // 初始化时设置事件监听
  private initEventListeners() {
    window.bus.on('PowerUp', this.buildUpEnergy());
    window.bus.on('LaunchBall', () => {
      this.launchBall();
    });
  }

  private buildUpEnergy() {
    return throttle(() => {
      this.powerUp();
    }, 100);
  }

  private powerUp() {
    if (this.mainScene.launch_ready) {
      this.force += 5;
      console.log(`蓄力中+++++++ (按钮触发) 当前力度: ${this.force}`);
    } else {
      console.log(`等待小球就位！！！！！！`);
    }
  }
  private launchBall() {
    if (this.mainScene.launch_ready) {
      console.log('力量：', this.force);
      this.mainScene.launchBall(this.force);
    }
    this.force = 5;
  }
}
