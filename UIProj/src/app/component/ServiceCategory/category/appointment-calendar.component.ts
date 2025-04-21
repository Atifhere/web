import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import { CompanyService } from '../../../_Service/Company/company.service';
import { AddAppointmentDialogComponent } from '../../login/Appointments/add-appointment-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { ConfirmArrivalDialogComponent } from '../../login/confirm-arrival-dialog/confirm-arrival-dialog.component';

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
  appointments = [
    {
      id: 1,
      customerName: 'Komal Atif',
      appointmentDate: '2025-04-24',
      appointmentTimeSlot: '10:30:00', // string (hh:mm:ss)
      customerPhone: '1234567890',
      hasArrived: true,
      BranchName: 'Branch A',
    },
    {
      id: 2,
      customerName: 'Komal Atif',
      appointmentDate: '2025-04-24',
      appointmentTimeSlot: '10:30:00', // string (hh:mm:ss)
      customerPhone: '1234567890',
      hasArrived: false,
      BranchName: 'Branch A',
    },
    {
      id: 3,
      customerName: 'Shayan Atif',
      appointmentDate: '2025-04-24',
      appointmentTimeSlot: '10:30:00', // string (hh:mm:ss)
      customerPhone: '1234567890',
      hasArrived: true,
      BranchName: 'Branch B',
    },
    {
      id: 6,
      customerName: 'Rameen Atif',
      appointmentDate: '2025-04-25',
      appointmentTimeSlot: '14:00:00',
      customerPhone: '1234567890',
      hasArrived: false,
      BranchName: 'Branch A',
    },
  ];
  handleEventClick(arg: EventClickArg): void {
    const appointment = arg.event.extendedProps;
    this.dialog.open(ConfirmArrivalDialogComponent, {
      width: '400px',
      data: {
        appointmentId: appointment['id'],
        customerName: appointment['customerName'],
        appointmentTime: arg.event.startStr,
      },
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: calendarPlugins,
    initialView: 'dayGridMonth',
    dateClick: this.onDateClick.bind(this), // bind to preserve `this`
    themeSystem: 'standard',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: this.appointments.map((appt) => ({
      title: appt.customerName,
      start: `${appt.appointmentDate}T${appt.appointmentTimeSlot}`,
      extendedProps: {
        phone: appt.customerPhone,
        id: appt.id,
        customerName: appt.customerName,
        hasArrived :appt.hasArrived,
        BranchName: appt.BranchName,
      },
      allDay: false,
    })),
    eventClick: this.handleEventClick.bind(this),
    eventContent: (arg) => {
      // Extract time from date string
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
            <div class="event-time">${time} - ${arg.event.title} - ${phone} </div>
            <div class="event-title"> ${hasArrived ? '✅  ' : ''}  ${branchName}</div>
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

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.companyService.getAppointments().subscribe((appointments: any[]) => {
      // appointments = [
      //   {
      //     customerName: 'Alice Johnson',
      //     appointmentDate: '2025-04-25',
      //     appointmentTimeSlot: '10:30:00', // string (hh:mm:ss)
      //   },
      //   {
      //     customerName: 'Bob Smith',
      //     appointmentDate: '2025-04-25',
      //     appointmentTimeSlot: '14:00:00',
      //   },
      // ]; // Mock data for testing
      // this.calendarOptions.events = appointments.map((a) => ({
      //   title: a.customerName,
      //   start: `${a.appointmentDate}T${a.appointmentTimeSlot}`,
      //   allDay: false,
      // }));
    });
  }

  onAddAppointmentClick() {
    this.dialog.open(AddAppointmentDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
  }
}
