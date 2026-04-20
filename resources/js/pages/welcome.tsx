import { Head, Link, usePage } from "@inertiajs/react";
import { dashboard, loginAs } from "@/routes";
import Logo from "@/components/logo";

export default function Welcome() {
    const { auth } = usePage().props as {
        auth: { user?: unknown };
    };

    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="IDOR Lab" />

            <div className="relative min-h-screen overflow-hidden bg-[#f6f4ef] text-[#1a1f1d]">
                <div className="orb absolute -top-20 -left-16 h-72 w-72 rounded-full bg-[#f2b880]/45 blur-3xl" />
                <div className="orb absolute top-24 -right-20 h-80 w-80 rounded-full bg-[#74b5a8]/35 blur-3xl [animation-delay:-2s]" />
                <div className="orb absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#ead89d]/45 blur-3xl [animation-delay:-4s]" />

                <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-10 sm:px-10 lg:py-14">
                    <header className="rise-in">
                        <div className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-[#24302c]">
                            <Logo />
                            <span className="ml-2">IDOR Lab</span>
                        </div>
                    </header>

                    <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
                        <div className="space-y-7">
                            <div className="rise-in delay-1 inline-flex items-center rounded-full border border-[#1a1f1d]/10 bg-white/65 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase text-[#31403b] backdrop-blur">
                                Controlled demonstration prototype
                            </div>

                            <h1 className="rise-in delay-1 text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-5xl">
                                Preventing IDOR
                                <br />
                                <span className="text-2xl sm:text-3xl md:text-4xl">in Web Applications & APIs</span>
                            </h1>

                            <p className="rise-in delay-2 max-w-2xl text-base leading-relaxed text-[#37433f] sm:text-lg">
                                A controlled prototype for demonstrating and evaluating an
                                IDOR Prevention Framework. The system focuses on object-level
                                authorisation, ownership checks, and consistent server-side
                                policy enforcement across routes, records, and file access
                                paths.
                            </p>

                            <div className="rise-in delay-3 flex flex-wrap items-center gap-3">
                                {isAuthenticated ? (
                                    <Link
                                        href={dashboard()}
                                        prefetch
                                        className="rounded-full bg-[#1a1f1d] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#111513] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1f1d]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f4ef]"
                                    >
                                        Open Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={loginAs("User A")}
                                            method="post"
                                            as="button"
                                            className="rounded-full bg-[#1a1f1d] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#111513] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1f1d]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f4ef]"
                                        >
                                            Login as User A
                                        </Link>

                                        <Link
                                            href={loginAs("User B")}
                                            method="post"
                                            as="button"
                                            className="rounded-full border border-[#1a1f1d]/20 bg-white/85 px-6 py-3 text-sm font-semibold text-[#1a1f1d] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1f1d]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f4ef]"
                                        >
                                            Login as User B
                                        </Link>

                                        <Link
                                            href={loginAs("Super Admin")}
                                            method="post"
                                            as="button"
                                            className="rounded-full border border-[#1a1f1d]/20 bg-[#74b5a8]/20 px-6 py-3 text-sm font-semibold text-[#1a1f1d] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#74b5a8]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74b5a8]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f4ef]"
                                        >
                                            Login as Super Admin
                                        </Link>
                                    </>
                                )}
                            </div>

                            {!isAuthenticated && (
                                <p className="rise-in delay-3 text-sm text-[#4a5a55]">
                                    Use the seeded users to compare insecure and secure access behaviour.
                                </p>
                            )}
                        </div>

                        <aside className="rise-in delay-2 rounded-3xl border border-[#1a1f1d]/15 bg-white/72 p-6 shadow-[0_20px_60px_-25px_rgba(19,26,22,0.35)] backdrop-blur sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5b6a65]">
                                Framework focus
                            </p>

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#16201d]">
                                Test object access before data is exposed.
                            </h2>

                            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#33413d]">
                                <div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/85 p-4">
                                    Verify ownership and role permissions before records are
                                    viewed, downloaded, or modified.
                                </div>
                                <div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/85 p-4">
                                    Enforce centralised policy checks across web routes, APIs,
                                    and document access paths.
                                </div>
                                <div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/85 p-4">
                                    Support repeatable IDOR-focused testing for before-and-after
                                    evaluation.
                                </div>
                            </div>
                        </aside>
                    </section>
                </main>

                <style>{`
                    @keyframes riseIn {
                        from {
                            opacity: 0;
                            transform: translateY(16px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes drift {
                        0% {
                            transform: translateY(0) translateX(0) scale(1);
                        }
                        50% {
                            transform: translateY(-16px) translateX(10px) scale(1.03);
                        }
                        100% {
                            transform: translateY(0) translateX(0) scale(1);
                        }
                    }

                    .rise-in {
                        animation: riseIn 700ms cubic-bezier(0.2, 0.75, 0.15, 1) both;
                    }

                    .delay-1 {
                        animation-delay: 120ms;
                    }

                    .delay-2 {
                        animation-delay: 220ms;
                    }

                    .delay-3 {
                        animation-delay: 320ms;
                    }

                    .orb {
                        animation: drift 10s ease-in-out infinite;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .rise-in,
                        .orb {
                            animation: none;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}