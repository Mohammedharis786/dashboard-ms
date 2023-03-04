import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RbacService } from 'src/app/core/services/rbac-service.service';
import { WrapperService } from 'src/app/core/services/wrapper.service';
import { config } from '../../config/review_meetings_config';
import { ReviewMeetingsConductedBignumberComponent } from './reports/review-meetings-conducted-bignumber/review-meetings-conducted-bignumber.component';
import { ReviewMeetingsConductedComponent } from './reports/review-meetings-conducted/review-meetings-conducted.component';
import { ReviewMeetingsStatusComponent } from './reports/review-meetings-status/review-meetings-status.component';

@Component({
  selector: 'app-review-meetings-tab',
  templateUrl: './review-meetings-tab.component.html',
  styleUrls: ['./review-meetings-tab.component.scss']
})
export class ReviewMeetingsTabComponent implements OnInit, AfterViewInit {

  bigNumberReports: any = {};
  minYear: any;
  maxYear: any;
  minMonth: any;
  maxMonth: any;
  academicYear: any = [];
  months: any = [];
  filters: any;
  reportsToBeShown: any = [];
  rbacDetails: any;
  reportsData: any = [];


  @ViewChild('reviewMeetingsConducted') reviewMeetingsConducted: ReviewMeetingsConductedComponent;
  @ViewChild('reviewMeetingsStatus') reviewMeetingsStatus: ReviewMeetingsStatusComponent;
  @ViewChild('reviewMeetingsConductedBignumber') reviewMeetingsConductedBignumber: ReviewMeetingsConductedBignumberComponent;
  constructor(private _wrapperService: WrapperService, private _rbacService: RbacService) {
    this._rbacService.getRbacDetails().subscribe((rbacDetails: any) => {
      this.rbacDetails = rbacDetails;
    })
  }

  async ngOnInit(): Promise<void> {
    // this.renderReports();
  }

  async ngAfterViewInit(): Promise<void> {
    this.filters = await this._wrapperService.constructCommonFilters(config.filters)
    this.reviewMeetingsConducted?.getReportData(this.filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
    this.reviewMeetingsStatus?.getReportData(this.filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
    this.reviewMeetingsConductedBignumber?.getReportData(this.filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
  }

  // renderReports() {
  //   let reportConfig = config;
  //   this.reportsToBeShown = Object.keys(reportConfig).filter((reportKey: any) => {
  //     let flag = false;
  //     reportConfig[reportKey]?.filters?.forEach((filter: any) => {
  //       if (Number(filter.hierarchyLevel) === Number(this.rbacDetails?.role) && Object.keys(filter?.actions?.queries).includes(this.reportType)) {
  //         flag = true
  //       }
  //     })
  //     return flag
  //   })
  //   console.log(this.reportsToBeShown)
  // }

  checkReport(key: string, reportType: string): Boolean {
    let reportConfig = config;
    let flag = false;
    reportConfig[key]?.filters?.forEach((filter: any) => {
      if (Number(filter.hierarchyLevel) === Number(this.rbacDetails?.role) && Object.keys(filter?.actions?.queries).includes(reportType)) {
        flag = true
      }
    })
    return flag
  }

  csvDownload(csvData: any) {
    if (csvData) {
      this.reportsData.push(csvData)
    }
    console.log(this.reportsData)
  }

  filtersUpdated(filters: any) {
    this.reviewMeetingsConductedBignumber?.getReportData(this.filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
    this.reviewMeetingsConducted?.getReportData(filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
    this.reviewMeetingsStatus?.getReportData(filters.map((filter) => { return { columnName: filter.valueProp, value: filter.value } }));
  }

}
