import {
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  inject,
  input,
  output,
} from '@angular/core';

import { IBalloon } from '../../balloon.interface';
import {
  AnimationBuilder,
  animate,
  keyframes,
  style,
} from '@angular/animations';

 
@Component({
  selector: 'app-balloon',
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.css'
})

export class BalloonComponent implements OnInit {
 
  ballon = input.required<IBalloon>();
  animBuilder: AnimationBuilder = inject(AnimationBuilder);
  elRef = inject(ElementRef);
 @Output() balloonPopped = new EventEmitter<string>();
 @Output() balloonMissed = new EventEmitter();
  ngOnInit(): void {
    this.animateBallon();
  }
  constructor() {
    
   
  }
  animateBallon(){
    const minSpeed = 2;
    const speedVariation = 3;
    const speed = minSpeed + Math.random() * speedVariation; // 5s - 10s

    const buffer = 20;
    const maxWidth =
      window.innerWidth -
      this.elRef.nativeElement.firstChild.clientWidth -
      buffer;
    const leftPosition = Math.floor(Math.random() * maxWidth);

    const flyAnimation = this.animBuilder.build([
              style({
                 translate: `${leftPosition}px 0`,
                position: 'fixed',
                left: '0',
                bottom: 0,
              
              }),
              animate( `${speed}s ease-in-out`,
                      style({ 
                        translate: `${leftPosition}px -100vh`,
                      }) ),
              ]);
  const player = flyAnimation.create(this.elRef.nativeElement.firstChild);
  player.play();
  player.onDone(() => {
    this.balloonMissed.emit(this.ballon().id);
  });




  }

  pop()
  {
    const popAnimation = this.animBuilder.build([
      animate(
        '0.2s ease-out',
        keyframes([
          style({
            scale: '1.2',
            offset: 0.5,
          }),
          style({
            scale: '0.8',
            offset: 0.75,
          }),
        ])
      ),
    ]);
    const player = popAnimation.create(this.elRef.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      this.balloonPopped.emit(this.ballon().id);
    });
  }
}
