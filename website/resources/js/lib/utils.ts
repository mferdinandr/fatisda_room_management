import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split('.').map((str) => parseInt(str));
    return hours * 60 + minutes;
};

export const getDuration = (start: string, end: string) => {
    return (timeToMinutes(end) - timeToMinutes(start)) / 60;
};
