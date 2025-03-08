import { Component, OnInit, signal, computed, viewChildren, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  imports: [ BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ballon-pop';
  BallonOnScreen = 3 ; 
  balloons : IBalloon[]=new Array (this.BallonOnScreen).fill(0)
  .map(()=> new  Balloon());
        
  
  balloonsOnScreen = 5;
  score = 0;
  missed = signal(0);
  maxMisses = 10;
  gameOver = computed(() => {
    return this.missed() === this.maxMisses;
  });
  balloonElements = viewChildren(BalloonComponent);

  createBalloonsOnDemand = effect(() => {
    if (
      !this.gameOver() &&
      this.balloonElements().length < this.balloonsOnScreen
    ) {
      this.balloons = [...this.balloons, new Balloon()];
    }
  });
  ngOnInit():void{  
    this.startGame();
  }
  
  balloonPoppedHandler(balloonId: string) {
    this.score++;
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
    this.balloons = [...this.balloons, new Balloon()];
  }
  balloonMissedHandler( balloonId: string) {
    this.missed.update(val=> val + 1);
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
  }
  
  startGame() {
    this.missed.set(0);
    this.score = 0;
    this.balloons = new Array(this.balloonsOnScreen)
      .fill(0)
      .map(() => new Balloon());
  }
}
