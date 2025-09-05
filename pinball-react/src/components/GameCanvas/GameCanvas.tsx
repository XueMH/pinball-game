import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { MainScene } from "@/scenes/MainScene";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current || undefined,
      width: 800,
      height: 1000,
      backgroundColor: "#f9f9f9",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 2.5 },
          debug: true,
        },
      },
      scene: [MainScene],
    };
    gameRef.current = new Phaser.Game(config);
    window.bus.on("MainSceneCreated", () => {
      console.log(
        "收到消息: MainSceneCreated",
        gameRef.current?.scene.getScene("MainScene")
      );
    });
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" />;
}
