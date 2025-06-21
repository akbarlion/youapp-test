import { RegisterForm } from "@/components/register-form"

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-radial">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}