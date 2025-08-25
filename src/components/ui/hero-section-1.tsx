import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { LoadingButton } from '@/components/ui/loading-button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Logos3 } from '@/components/ui/logos3'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    const [isSignUpLoading, setIsSignUpLoading] = React.useState(false)
    const [isGitHubLoading, setIsGitHubLoading] = React.useState(false)
    const router = useRouter()

    const handleGetStartedClick = () => {
        setIsSignUpLoading(true)
        // Redirect to task page for authenticated users
        setTimeout(() => {
            router.push('/task')
        }, 1000)
    }

    const handleGitHubClick = () => {
        setIsGitHubLoading(true)
        // Simulate loading for demo - in real app this would be navigation
        setTimeout(() => {
            window.open('https://github.com/your-org/async-coder', '_blank')
            setIsGitHubLoading(false)
        }, 1000)
    }

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden relative z-10">

                <section className="min-h-screen">
                    <div className="relative pt-32 md:pt-44 lg:pt-48 min-h-screen">




                        <div className="mx-auto max-w-7xl px-6 relative z-20">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/sign-up"
                                        className="hover:bg-white/10 bg-white/5 group mx-auto flex w-fit items-center gap-4 rounded-full border border-white/20 p-1 pl-4 shadow-md shadow-black/20 transition-all duration-300 backdrop-blur-sm">
                                        <span className="text-white text-sm">Introducing Autonomous AI Development</span>
                                        <span className="block h-4 w-0.5 border-l border-white/30 bg-white/30"></span>

                                        <div className="bg-white/10 group-hover:bg-white/20 size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold text-white">
                                        The last AI assistant you'll ever need for coding
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-white/90">
                                        An open-source, end-to-end AI coding assistant built to empower developers with full control, unmatched flexibility, and an autonomous development pipeline.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <SignedOut>
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[14px] border p-0.5">
                                            <SignInButton mode="modal">
                                                <LoadingButton
                                                    size="lg"
                                                    className="rounded-xl px-5 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                    <span className="text-nowrap">Get Started Now</span>
                                                </LoadingButton>
                                            </SignInButton>
                                        </div>
                                    </SignedOut>
                                    <SignedIn>
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[14px] border p-0.5">
                                            <LoadingButton
                                                size="lg"
                                                loading={isSignUpLoading}
                                                loadingText="Getting Started..."
                                                onClick={handleGetStartedClick}
                                                className="rounded-xl px-5 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                <span className="text-nowrap">Go to Dashboard</span>
                                            </LoadingButton>
                                        </div>
                                    </SignedIn>
                                    <LoadingButton
                                        key={2}
                                        size="lg"
                                        variant="ghost"
                                        loading={isGitHubLoading}
                                        loadingText="Opening GitHub..."
                                        onClick={handleGitHubClick}
                                        className="h-10.5 rounded-xl px-5 text-white hover:bg-white/10 border border-white/20">
                                        <span className="text-nowrap">View on GitHub</span>
                                    </LoadingButton>
                                </AnimatedGroup>
                            </div>
                        </div>


                    </div>
                </section>
                <section className="relative">
                    <Logos3 />
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'AI Backends', href: '#ai-backends' },
    { name: 'Quick Start', href: '#quick-start' },
    { name: 'Roadmap', href: '#roadmap' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isLoginLoading, setIsLoginLoading] = React.useState(false)
    const [isSignUpNavLoading, setIsSignUpNavLoading] = React.useState(false)
    const [isGetStartedLoading, setIsGetStartedLoading] = React.useState(false)
    const router = useRouter()

    const handleGetStartedClick = () => {
        setIsGetStartedLoading(true)
        setTimeout(() => {
            router.push('/task')
        }, 1000)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-50 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-50 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-white/80 hover:text-white block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <LoadingButton
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <span>Login</span>
                                        </LoadingButton>
                                    </SignInButton>
                                    <SignInButton mode="modal">
                                        <LoadingButton
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <span>Sign Up</span>
                                        </LoadingButton>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className={cn(isScrolled && 'lg:hidden')}>
                                        <UserButton 
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-8 h-8"
                                                }
                                            }}
                                        />
                                    </div>
                                    <LoadingButton
                                        size="sm"
                                        loading={isGetStartedLoading}
                                        loadingText="Getting Started..."
                                        onClick={handleGetStartedClick}
                                        className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                        <span>Go to Dashboard</span>
                                    </LoadingButton>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="text-xl font-bold text-white">
                Async Coder
            </span>
        </div>
    )
}