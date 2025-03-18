import AuthForm from './AuthForm'
import Logo from './Logo'

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:block w-1/2">
        <Logo />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}

