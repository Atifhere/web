import { Component, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import { CompanyService } from '../../_Service/Company/company.service';
import { AddAppointmentDialogComponent } from '../login/Appointments/add-appointment-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { ConfirmArrivalDialogComponent } from '../login/confirm-arrival-dialog/confirm-arrival-dialog.component';
import { AppointmentsDto } from '../../_model/Appointments.modal';
import { FullCalendarComponent } from '@fullcalendar/angular';

const calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FullCalendarModule, MaterialModule],
  templateUrl: './appointment-calendar.component.html',
  styleUrl: './appointment-calendar.component.css',
})
export class AppointmentsComponent {
  // Define the events for the calendar
  appointments: AppointmentsDto[] = [];
  // Define the calendar options
  ngOnInit(): void {
    this.loadAppointments();
  }

  // loadAppointments() {
  //   this.companyService.getAppointments().subscribe((appointments: any[]) => {
  //     this.appointments = appointments;
  //   });
  // }

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // Handle the event click
  handleEventClick(arg: EventClickArg): void {
    const appointment = arg.event.extendedProps;
    const dialogRef = this.dialog.open(ConfirmArrivalDialogComponent, {
      width: '400px',
      data: {
        appointmentId: appointment['id'],
        customerName: appointment['customerName'],
        appointmentTime: arg.event.startStr,
      },
    });
  
    // After the dialog closes
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadAppointments(); // 🔁 Reload the updated data
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: calendarPlugins,
    initialView: 'dayGridMonth',
    dateClick: this.onDateClick.bind(this),
    themeSystem: 'standard',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [], // start with empty
    eventClick: this.handleEventClick.bind(this),
    eventContent: (arg) => {
      const time = new Date(arg.event.startStr).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const phone = arg.event.extendedProps['phone'];
      const hasArrived = arg.event.extendedProps['hasArrived'];
      const branchName = arg.event.extendedProps['BranchName'];
      return {
        html: `
          <div class="event-box">
            <div class="event-time">${time} - ${
          arg.event.title
        } - ${phone}</div>
            <div class="event-title">${
              hasArrived ? '✅' : ''
            } ${branchName}</div>
          </div>
        `,
      };
    },
    height: 'auto',
    eventDisplay: 'block',
    editable: false,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: true },
    slotMinTime: '09:00:00',
    slotMaxTime: '21:00:00',
    selectable: true,
    nowIndicator: true,
    locale: 'en-GB',
    weekNumbers: true,
  };

  loadAppointments() {
    this.companyService.getAppointments().subscribe((appointments: any) => {
      this.appointments = appointments.appointments;
      const mappedEvents = this.appointments.map((appt) => ({
        title: appt.customerName,
        start: `${appt.appointmentDate}T${appt.appointmentTimeSlot}`,
        extendedProps: {
          phone: appt.customerPhone,
          id: appt.id,
          customerName: appt.customerName,
          hasArrived: appt.hasArrived,
          BranchName: appt.branchName,
        },
        allDay: false,
      }));

      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents(); // remove existing events if needed
      calendarApi.addEventSource(mappedEvents);
    });
  }
  onDateClick(arg: DateClickArg) {
    this.dialog.open(AddAppointmentDialogComponent, {
      data: { date: arg.date },
      width: '600px',
      maxHeight: '90vh',
    });
  }
  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog
  ) {}

  onAddAppointmentClick() {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadAppointments();
    });
  }
}
