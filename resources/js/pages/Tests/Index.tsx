import { Head, router } from "@inertiajs/react";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { index as tests } from "@/routes/tests";

type TestRunResult = {
	exit_code: number;
	status: "passed" | "failed";
	output: string;
	tests: {
		name: string;
		status: "passed" | "failed";
		suite: string | null;
	}[];
};

type TestsIndexProps = {
	result?: TestRunResult | null;
};

export default function TestsIndex({ result }: TestsIndexProps) {
	const [isRunning, setIsRunning] = useState(false);

	const suites = useMemo(() => {
		if (!result) {
			return [] as {
				name: string;
				status: "passed" | "failed";
				tests: { key: string; name: string; status: "passed" | "failed" }[];
			}[];
		}

		const suitesMap = new Map<
			string,
			{
				name: string;
				status: "passed" | "failed";
				tests: { key: string; name: string; status: "passed" | "failed" }[];
			}
		>();

		for (const test of result.tests) {
			const suiteName = test.suite ?? "Unknown Suite";
			const currentSuite = suitesMap.get(suiteName);

			if (!currentSuite) {
				suitesMap.set(suiteName, {
					name: suiteName,
					status: test.status,
					tests: [
						{
							key: `${suiteName}::${test.name}::0`,
							name: test.name,
							status: test.status,
						},
					],
				});

				continue;
			}

			if (test.status === "failed") {
				currentSuite.status = "failed";
			}

			currentSuite.tests.push({
				key: `${suiteName}::${test.name}::${currentSuite.tests.length}`,
				name: test.name,
				status: test.status,
			});
		}

		return Array.from(suitesMap.values());
	}, [result]);

	const summary = useMemo(() => {
		if (!result) {
			return {
				testsLine: null as string | null,
				durationLine: null as string | null,
				testsLineSegments: [] as {
					key: string;
					text: string;
					kind: "passed" | "failed" | "plain";
				}[],
			};
		}

		const lines = result.output.split(/\r?\n/).map((line) => line.trim());
		const testsLine = lines.find((line) => line.startsWith("Tests:")) ?? null;
		const durationLine =
			lines.find((line) => line.startsWith("Duration:")) ?? null;

		const testsLineSegments: {
			key: string;
			text: string;
			kind: "passed" | "failed" | "plain";
		}[] = [];

		if (testsLine) {
			const segmentCounts = new Map<string, number>();
			const segments = testsLine
				.split(/(\d+\s+passed|\d+\s+failed)/gi)
				.filter((segment) => segment.length > 0);

			for (const segment of segments) {
				const kind = /\d+\s+passed/i.test(segment)
					? "passed"
					: /\d+\s+failed/i.test(segment)
						? "failed"
						: "plain";

				const baseKey = `${kind}:${segment}`;
				const nextCount = (segmentCounts.get(baseKey) ?? 0) + 1;
				segmentCounts.set(baseKey, nextCount);

				testsLineSegments.push({
					key: `${baseKey}:${nextCount}`,
					text: segment,
					kind,
				});
			}
		}

		return {
			testsLine,
			durationLine,
			testsLineSegments,
		};
	}, [result]);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsRunning(true);

		router.get(
			tests.url(),
			{
				run: 1,
			},
			{
				preserveState: true,
				onFinish: () => setIsRunning(false),
			},
		);
	};

	return (
		<>
			<Head title="Automated Tests" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-1">
						<h1 className="text-2xl font-bold tracking-tight">
							Automated Tests
						</h1>
						<p className="text-sm text-muted-foreground">
							Run automated tests to verify that the IDOR prevention mechanisms
							are working as expected.
						</p>
						<p className="text-sm text-muted-foreground"></p>
					</div>

					<form onSubmit={onSubmit}>
						<button
							type="submit"
							disabled={isRunning}
							className="inline-flex h-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sidebar-border"
						>
							{isRunning ? "Running..." : "Run Tests"}
						</button>
					</form>
				</div>

				{result ? (
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Summary
						</h2>
						<div className="space-y-1 text-sm text-foreground">
							<p className="whitespace-pre-wrap">
								{summary.testsLine
									? summary.testsLineSegments.map((segment) => {
											if (segment.kind === "passed") {
												return (
													<span
														key={segment.key}
														className="font-bold text-emerald-700 dark:text-emerald-300"
													>
														{segment.text}
													</span>
												);
											}

											if (segment.kind === "failed") {
												return (
													<span
														key={segment.key}
														className="font-bold text-rose-700 dark:text-rose-300"
													>
														{segment.text}
													</span>
												);
											}

											return <span key={segment.key}>{segment.text}</span>;
										})
									: `Tests:    ${result.status} (exit ${result.exit_code})`}
							</p>
							<p>{summary.durationLine ?? "Duration: N/A"}</p>
						</div>
					</div>
				) : null}

				<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Result
						</h2>
						{result ? (
							<span className="text-xs text-muted-foreground">
								{suites.length} suite{suites.length === 1 ? "" : "s"} ·{" "}
								{result.tests.length} test
								{result.tests.length === 1 ? "" : "s"}
							</span>
						) : null}
					</div>

					{result && suites.length > 0 ? (
						<div className="space-y-4">
							{suites.map((suite) => (
								<section
									key={suite.name}
									className="rounded-md bg-muted/20 p-3"
								>
									<div className="mb-2 flex items-center justify-between gap-3">
										<h3 className="truncate text-sm font-semibold text-foreground">
											{suite.name}
										</h3>
										<span
											className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
												suite.status === "passed"
													? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
													: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
											}`}
										>
											{suite.status}
										</span>
									</div>

									<ul className="space-y-2">
										{suite.tests.map((test) => (
											<li
												key={test.key}
												className="flex items-start gap-2 text-sm text-foreground"
											>
												{test.status === "passed" ? (
													<Check
														className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
														aria-label="passed"
													/>
												) : (
													<X
														className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400"
														aria-label="failed"
													/>
												)}
												<span className="min-w-0 wrap-break-word">
													{test.name}
												</span>
											</li>
										))}
									</ul>
								</section>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							Run tests to see results here.
						</p>
					)}
				</div>
			</div>
		</>
	);
}

TestsIndex.layout = {
	breadcrumbs: [
		{
			title: "Automated Tests",
			href: tests(),
		},
	],
};
