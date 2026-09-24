import { Room } from './GameEngine.js';

export class TimerManager {
  startTimer(room: Room, durationSec: number, onTick: (remaining: number) => void, onExpire: () => void): void {
    this.clearTimer(room);
    room.timeRemaining = durationSec;
    onTick(room.timeRemaining);
    
    room.timerHandle = setInterval(() => {
      room.timeRemaining--;
      if (room.timeRemaining <= 0) {
        this.clearTimer(room);
        onTick(0);
        onExpire();
      } else {
        onTick(room.timeRemaining);
      }
    }, 1000);
  }

  clearTimer(room: Room): void {
    if (room.timerHandle) {
      clearInterval(room.timerHandle);
      room.timerHandle = null;
    }
    room.timeRemaining = 0;
  }
}
