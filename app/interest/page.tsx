import InterestForm from '@/components/interest-form';

export default function Home() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-radial">
            <div className="w-full max-w-sm flex flex-col mb-4">
                <p className="font-inter font-bold text-sm text-white mb-1">Tell everyone about yourself</p>
                <p className="font-inter font-bold text-xl text-white">What interest you?</p>
            </div>
            <div className="w-full max-w-sm relative z-10">
                <div className="absolute inset-0 -z-10"></div>
                <InterestForm />
            </div>
        </div>
    )
}
