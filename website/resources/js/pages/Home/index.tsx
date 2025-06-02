import Navbar from '@/components/Client/Navbar/Navbar';
import Sidebar from '@/components/Client/Sidebar/Sidebar';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] px-3 py-4 text-[#1b1b18] md:px-8 lg:justify-center">
                <Navbar />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse text-white lg:max-w-4xl lg:flex-row">
                        <Sidebar />
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
