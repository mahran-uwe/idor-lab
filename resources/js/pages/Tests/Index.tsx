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
			<Head title="Test Runner" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Test Runner</h1>
					<p className="text-sm text-muted-foreground">
						Run the full test suite and review each test with a pass/fail badge.
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border"
				>
					<button
						type="submit"
						disabled={isRunning}
						className="inline-flex h-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sidebar-border"
					>
						{isRunning ? "Running..." : "Run Tests"}
					</button>
				</form>

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
			title: "Test Runner",
			href: tests(),
		},
	],
};
