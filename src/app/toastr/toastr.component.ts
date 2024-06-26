import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../services/toast.service';
import { AsyncPipe } from '@angular/common';
import { TOAST_STATE } from '../services/toast.service';

@Component({
  selector: 'app-toastr',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.css',
  animations: [
    trigger("toastTrigger", [
      state("open", style({
        transform: "translateY(0)"
      })),
      state("close", style({
        transform: "translateY(-200%)"
      })),
      transition("open <=> close", [
        animate("300ms ease-in-out")
      ])
    ])
  ]
})
export class ToastrComponent {
  public TOAST_STATE = TOAST_STATE;

  constructor(public toastService: ToastService) { }

  dismiss(): void {
    this.toastService.dismissToast();
  }
}
