import GameUI from '@/components/GameUI/GameUI';
import GameCanvas from '@/components/GameCanvas/GameCanvas';

export default function GamePage() {
  return (
    <div className="w-full h-full max-w-full max-h-full flex justify-center items-center flex-col">
      <GameUI>
        <GameCanvas></GameCanvas>
      </GameUI>
    </div>
  );
}
