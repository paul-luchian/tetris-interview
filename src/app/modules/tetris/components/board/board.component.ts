import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  @Input() board: Board;

  @Input() redraw$: Observable<void>;

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.redraw$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        if (!this.board.figure) { return; }
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
