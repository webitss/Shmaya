import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-dialog',
    template: `<div dir="rtl" *ngIf="visible" class="dialog">
        <ng-content></ng-content>
        <button *ngIf="closable" (click)="close()" aria-label="Close" class="dialog__close-btn">X</button>
    </div>
    <div *ngIf="visible" class="overlay" (click)="close()"></div>`,
    styles: [``],
    animations: [
        trigger('dialog', [
            transition('void => *', [
                style({ transform: 'scale3d(.3, .3, .3)' }),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
            ])
        ])
    ]
})
export class DialogComponent implements OnInit {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

   constructor() { }

   ngOnInit() { }

   close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}