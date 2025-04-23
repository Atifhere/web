export interface AppointmentsDto {
  id: string;
  customerName: string;
  appointmentDate: string;       // Format: yyyy-mm-dd
  appointmentTimeSlot: string;   // Format: hh:mm:ss
  customerPhone: string;
  hasArrived: boolean;
  branchName: string;
}
  
  // Sample data for appointments
  // appointments: AppointmentsDto[] = [
  //   {
  //     id: 1,
  //     customerName: 'Komal Atif',
  //     appointmentDate: '2025-04-24',
  //     appointmentTimeSlot: '18:30:00', // string (hh:mm:ss)
  //     customerPhone: '1234567890',
  //     hasArrived: true,
  //     BranchName: 'Branch A',
  //   },
  //   {
  //     id: 2,
  //     customerName: 'Komal Atif',
  //     appointmentDate: '2025-04-24',
  //     appointmentTimeSlot: '10:30:00', // string (hh:mm:ss)
  //     customerPhone: '1234567890',
  //     hasArrived: false,
  //     BranchName: 'Branch A',
  //   },
  //   {
  //     id: 3,
  //     customerName: 'Shayan Atif',
  //     appointmentDate: '2025-04-25',
  //     appointmentTimeSlot: '12:30:00', // string (hh:mm:ss)
  //     customerPhone: '1234567890',
  //     hasArrived: true,
  //     BranchName: 'Branch B',
  //   },

  //   {
  //     id: 3,
  //     customerName: 'Shayan Atif',
  //     appointmentDate: '2025-04-25',
  //     appointmentTimeSlot: '08:30:00', // string (hh:mm:ss)
  //     customerPhone: '1234567890',
  //     hasArrived: true,
  //     BranchName: 'Branch B',
  //   },
  // ];