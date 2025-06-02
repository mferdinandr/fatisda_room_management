import Navbar from '@/components/Client/Navbar';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] px-6 py-4 text-[#1b1b18] lg:justify-center lg:px-8">
                <Navbar />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse text-white lg:max-w-4xl lg:flex-row">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis, reprehenderit assumenda! Ex, quos itaque? Facilis animi
                        libero omnis a, rem perferendis in amet, impedit ea, magni quas quia culpa vitae accusamus molestiae harum! Recusandae
                        officiis perferendis, laudantium odit excepturi a? Quos, quasi maiores commodi debitis nostrum eum ea quisquam voluptatem
                        velit corrupti corporis impedit quo atque libero quas doloribus eius rem odit dolor eaque neque ipsa accusantium? Atque quis
                        veniam, vero perspiciatis at rem possimus officia consequuntur eum cum dolorum alias laudantium doloremque eius distinctio
                        labore iste? Officiis non, vitae ullam in quasi numquam, cupiditate quae, quas corrupti quis aut?
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
