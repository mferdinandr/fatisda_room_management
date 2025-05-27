import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    className?: string;
}

export default function AuthSimpleLayout({ children, title, description, className }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className={`flex items-center justify-center gap-6 ` + className}>
            <div className="max-w-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <span className="sr-only">{title}</span>
                        </Link>
                        <div className="text-center">
                            <img src="/image/logo.png" alt="Book in Hand" className="w-24" />
                            {title && (
                                <>
                                    <h1 className="text-xl font-medium">{title}</h1>
                                    <p className="text-muted-foreground text-center text-sm">{description}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}
