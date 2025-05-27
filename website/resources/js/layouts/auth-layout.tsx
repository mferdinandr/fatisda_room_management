import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

type AuthLayoutProps = {
    title?: string;
    children: React.ReactNode;
    description?: string;
    heading1?: string;
    heading2?: string;
    imagePath?: string;
};

export default function AuthLayout({ children, title, description, heading1, heading2, imagePath, ...props }: AuthLayoutProps) {
    return (
        <div className="bg-secondary flex h-screen w-screen flex-col items-center md:flex-row">
            <div className="48508D text-on-background flex h-1/4 w-screen flex-col justify-center bg-gradient-to-r from-[#141627] to-[#48508D] text-lg md:h-screen md:w-1/2">
                <p className="px-4 text-6xl sm:pl-20">
                    {heading1}
                    <br /> <span className="font-heading">{heading2}</span>
                </p>
                <img src={`/image/vector/${imagePath}`} alt="Book in Hand" className="hidden w-1/2 place-self-center md:block" />
            </div>
            <AuthLayoutTemplate title={title} description={description} {...props} className="md:w-1/2">
                <div>{children}</div>
            </AuthLayoutTemplate>
        </div>
    );
}
