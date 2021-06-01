import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventDto } from '../event/eventDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CalendarEventDto } from '../models/calendarEvent';
import {formatDate} from '@angular/common';
import { stringify } from '@angular/compiler/src/util';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['calendar.component.css'],
  templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  modalRef;
  i = 0;
  owner = false;
  userEvents = false;
  newEvent: CalendarEvent;
  view = 'month';
  viewDate: Date = new Date();

  modalData: {
    action: string;
    // adTitle: string;
    eventTitle: string;
    eventStart: Date;
    eventEnd: Date;
    status: string;
    index: number;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent('Edited', event, 0);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        // this.handleEvent('Deleted', event, 0);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  calendarEventsDto: CalendarEventDto[] = [];
  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal,
              public snackBar: MatSnackBar,
              public userService: UserService,
              private router: Router) {}

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
  event.start = newStart;
  event.end = newEnd;
  this.handleEvent('Dropped or resized', event, 0);
  this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent, index: number): void {
    const num = this.i++;
    console.log(index);
    // this.modalData = { event, action, num };
    const eventTitle = event.title;
    const eventStart = event.start;
    const eventEnd = event.end;
    // const eventTitle = this.calendarEventsDto[index].eventTitle;
    // let status: string;
    const status = this.calendarEventsDto[index].status;
    // if (this.calendarEventsDto[index].status === 'ACCEPTED') {
    //   status = 'Programare acceptată';
    // } else {
    //   status = 'În așteptare';
    // }
    this.modalData = {action, eventTitle, eventStart, eventEnd, index, status};
    this.modalRef = this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit() {
    this.userService.getBookedEvents().subscribe(
      response => {
        console.log(response);
        this.calendarEventsDto = response;
        this.calendarEventsDto.forEach(
          calendarEvent => {
            const event: CalendarEvent = {
              title: calendarEvent.message,
              start: startOfDay(new Date()),
              end: endOfDay(new Date()),
              color: colors.red,
              draggable: false,
              resizable: {
                beforeStart: true,
                afterEnd: true
              }
            };
            event.start = new Date(calendarEvent.startDate)
            event.end = new Date(calendarEvent.endDate);
            console.log(event);
            this.events.push(event);
            this.refresh.next();
          }
        )
      }
    )
  }

  closeModal() {
    this.modalRef.close(true);
  }

  eventDetails(index: number) {
    this.closeModal();
    this.router.navigate(['/EventDetails', this.calendarEventsDto[index].eventId]);
  }
  
}