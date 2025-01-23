import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?:
    | "primary"
    | "default"
    | "secondary"
    | "danger"
    | "success"
    | "outline";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

interface DoctorAvailability {
  doctorId: string;
  date: string; // e.g., '2025-01-19'
  slots: { time: string; available: boolean }[]; // e.g., [{ time: '9:00 AM', available: true }]
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // e.g., '2025-01-19'
  time: string; // e.g., '9:00 AM'
  status: "booked" | "cancelled";
}
