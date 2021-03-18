import { AtcUser } from '../../shared/model/atc-user';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() tableRecords: AtcUser[];
  @Output() searchInput = new EventEmitter();
  
  dataSource: any;
  displayedColumns: string[];

  constructor() {
  }

  ngOnChanges() {
    this.displayedColumns = Object.keys(this.tableRecords[0]);
    this.dataSource = new MatTableDataSource<AtcUser>(this.tableRecords);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchRecord(searchItem) {
    this.searchInput.emit(searchItem);
  }
}

