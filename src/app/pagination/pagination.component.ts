import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() goTo = new EventEmitter<number>();
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();

  @Input() currentPage = 0;
  @Input() totalPages = 0;

  pages: number[] = [];
  isMobile = false;

  constructor(private responsive: BreakpointObserver) { }

  ngOnInit(): void {
    this.responsive.observe(Breakpoints.XSmall).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.isMobile = this.responsive.isMatched(Breakpoints.XSmall);
  }

  public onGoTo(page: number): void {
    this.goTo.emit(page - 1);
  }

  public onNext(): void {
    this.next.emit(this.currentPage + 1);
  }

  public onPrevious(): void {
    this.previous.emit(this.currentPage - 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes["currentPage"] && changes["currentPage"].currentValue) ||
      (changes["totalPages"] && changes["totalPages"].currentValue)) {
      this.pages = this.getPages(this.currentPage + 1, this.totalPages);
    }
  }

  private getPages(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 7)
      return [...Array(totalPages).keys()].map(x => ++x);

    if (currentPage > 5) {
      if (currentPage >= totalPages - 4)
        return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      else
        return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
    }

    return [1, 2, 3, 4, 5, -1, totalPages];
  }
}
