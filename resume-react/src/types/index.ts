// Define common types used throughout the application

// Theme type
export type Theme = 'light' | 'dark';
export type ThemeOption = Theme | 'system';

// Contact form data type
export interface ContactFormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

// Skill type
export interface Skill {
  name: string;
  percentage: number;
}

// Counter props type
export interface CounterProps {
  start: number;
  end: number;
  duration: number;
  element: HTMLElement;
}