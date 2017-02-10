import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { DonationModel, DonationService } from '../index';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations.list.component.html',
  styleUrls: ['./donations.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DonationService]
})

export class DonationsListComponent implements OnChanges {

  // FIXME Implement interface for targets as Leaader, Project, Task
  @Input() target: any;
  // Either Leader, Project or Task
  @Input() targetType: string;

  private donations: BehaviorSubject<any> = new BehaviorSubject([{title: 'Loading...'}]);

  ngOnChanges(changes) {
    const target = changes.target.currentValue;
    if (target && target._id) {
      this.requestDonations(target);
    }
  }

  constructor(
    private donationService: DonationService,
    private http: Http
  ) {}

  requestDonations(target) {
    const proxySub = this.donationService.getDonations('', target._id, this.targetType).subscribe(donations => {
      this.donations.next(donations);
      proxySub.unsubscribe();
    });
  }

}