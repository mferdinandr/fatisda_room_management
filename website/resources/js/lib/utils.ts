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

export const randomizeColorBackground = () => {
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-emerald-500',
        'bg-lime-500',
        'bg-amber-500',
        'bg-rose-500',
        'bg-violet-500',
        'bg-sky-500',
        'bg-slate-500',
        'bg-gray-500',
        'bg-zinc-500',
        'bg-stone-500',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
};
