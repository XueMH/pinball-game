import { MainScene } from "./MainScene";
import { throttle } from "lodash";

export class InputController {
  private mainScene: MainScene;
  force: number = 5;

  constructor(scene: MainScene) {
    this.mainScene = scene;
    this.keyboardListener();
  }

  private keyboardListener() {
    // 监听输入
    this.mainScene?.input?.keyboard?.on(
      "keydown-SPACE",
      throttle(() => {
        if (this.mainScene.launch_ready) {
          this.force += 2;
          console.log(`\r蓄力中+++++++`);
        } else {
          console.log(`\r等待小球就位！！！！！！`);
        }
      }, 1)
    );
    this.mainScene?.input?.keyboard?.on("keyup-SPACE", () => {
      if (this.mainScene.launch_ready) {
        console.log("力量：", this.force);
        this.mainScene.launchBall(this.force);
      }
      this.force = 5;
    });
  }
}
