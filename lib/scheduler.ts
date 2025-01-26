interface Doctor {
  id: string;
  name: string;
  availableSlots: number; // Number of 10-minute slots available
}

interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  patientId: string;
  doctorId: string;
  time: string; // Time of the appointment
}

const scheduleAppointments = (doctors: Doctor[], patients: Patient[], selectedTime: string): Appointment[] => {
  const appointments: Appointment[] = [];
  const timeSlotDuration = 10; // Duration in minutes

  for (const patient of patients) {
    for (const doctor of doctors) {
      if (doctor.availableSlots > 0) {
        const appointmentTime = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        appointments.push({
          patientId: patient.id,
          doctorId: doctor.id,
          time: appointmentTime,
        });
        doctor.availableSlots -= 1; // Decrease available slots
        break; // Move to the next patient after scheduling
      }
    }
  }

  return appointments;
};

export { scheduleAppointments, Doctor, Patient, Appointment };
