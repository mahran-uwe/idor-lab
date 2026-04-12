import { Head, Link, usePage } from "@inertiajs/react";
import { dashboard, loginAs } from "@/routes";

export default function Welcome() {
	const { auth } = usePage().props;
	const isAuthenticated = Boolean(auth.user);

	return (
		<>
			<Head title="Welcome" />

			<div className="relative min-h-screen overflow-hidden bg-[#f6f4ef] text-[#1a1f1d]">
				<div className="orb absolute -top-20 -left-16 h-72 w-72 rounded-full bg-[#f2b880]/45 blur-3xl" />
				<div className="orb absolute top-24 -right-20 h-80 w-80 rounded-full bg-[#74b5a8]/35 blur-3xl [animation-delay:-2s]" />
				<div className="orb absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#ead89d]/45 blur-3xl [animation-delay:-4s]" />

				<main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-10 sm:px-10 lg:py-14">
					<header className="rise-in">
						<p className="inline-flex items-center rounded-full border border-[#1a1f1d]/15 bg-white/75 px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase shadow-sm backdrop-blur">
							IDOR Lab
						</p>
					</header>

					<section className="grid items-center gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
						<div className="space-y-7">
							<h1 className="rise-in delay-1 text-4xl leading-tight font-black tracking-tight sm:text-5xl lg:text-6xl">
								Preventing IDOR
								<br />
								in Web Applications
							</h1>

							<p className="rise-in delay-2 max-w-2xl text-base leading-relaxed text-[#37433f] sm:text-lg">
								A demonstration prototype for evaluating an IDOR Prevention
								Framework in a controlled web application. The system focuses on
								object-level authorization, ownership checks, and consistent
								server-side policy enforcement across routes, records, and file
								access paths.
							</p>

							<div className="rise-in delay-3 flex flex-wrap items-center gap-3">
								{isAuthenticated ? (
									<Link
										href={dashboard()}
										prefetch
										className="rounded-full bg-[#1a1f1d] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#111513]"
									>
										Open Dashboard
									</Link>
								) : (
									<>
										<Link
											href={loginAs("User A")}
											method="post"
											as="button"
											className="rounded-full bg-[#1a1f1d] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#111513]"
										>
											Login as User A
										</Link>

										<Link
											href={loginAs("User B")}
											method="post"
											as="button"
											className="rounded-full border border-[#1a1f1d]/20 bg-white/80 px-6 py-3 text-sm font-semibold text-[#1a1f1d] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
										>
											Login as User B
										</Link>

										<Link
											href={loginAs("Super Admin")}
											method="post"
											as="button"
											className="rounded-full border border-[#1a1f1d]/20 bg-[#74b5a8]/20 px-6 py-3 text-sm font-semibold text-[#1a1f1d] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#74b5a8]/30"
										>
											Login as Super Admin
										</Link>
									</>
								)}
							</div>
						</div>

						<aside className="rise-in delay-2 rounded-3xl border border-[#1a1f1d]/15 bg-white/70 p-6 shadow-[0_20px_60px_-25px_rgba(19,26,22,0.35)] backdrop-blur sm:p-8">
							<h2 className="mt-3 text-2xl font-bold tracking-tight text-[#16201d]">
								Test object access before data is exposed.
							</h2>

							<div className="mt-6 space-y-4 text-sm text-[#33413d]">
								<div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/80 p-4">
									Verify ownership and role permissions before showing or
									modifying records.
								</div>
								<div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/80 p-4">
									Enforce centralized policy checks for web routes, APIs, and
									document access.
								</div>
								<div className="rounded-2xl border border-[#1a1f1d]/10 bg-white/80 p-4">
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
                    transform: translateY(-16px) translateX(10px)
                        scale(1.03);
                }
                100% {
                    transform: translateY(0) translateX(0) scale(1);
                }
            }

            .rise-in {
                animation: riseIn 700ms cubic-bezier(0.2, 0.75, 0.15, 1)
                    both;
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
