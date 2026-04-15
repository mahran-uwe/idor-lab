import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { index as tests } from "@/routes/tests";

type TestRunResult = {
	exit_code: number;
	status: "passed" | "failed";
	output: string;
};

type TestsIndexProps = {
	requestedPath?: string | null;
	requestedFilter?: string | null;
	result?: TestRunResult | null;
};

export default function TestsIndex({
	requestedPath,
	requestedFilter,
	result,
}: TestsIndexProps) {
	const [testPath, setTestPath] = useState(requestedPath ?? "");
	const [filter, setFilter] = useState(requestedFilter ?? "");
	const [isRunning, setIsRunning] = useState(false);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsRunning(true);

		router.get(
			tests.url(),
			{
				run: 1,
				test_path: testPath || undefined,
				filter: filter || undefined,
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
						Run all tests or narrow down by a specific test file and optional
						filter.
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="grid gap-3 rounded-xl border border-sidebar-border/70 bg-background/80 p-4 md:grid-cols-[2fr_2fr_auto] dark:border-sidebar-border"
				>
					<div className="space-y-1">
						<label
							htmlFor="test-path"
							className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
						>
							Test file path (optional)
						</label>
						<input
							id="test-path"
							type="text"
							placeholder="tests/Feature/Documents/InsecureDocumentControllerTest.php"
							value={testPath}
							onChange={(event) => setTestPath(event.target.value)}
							className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-sidebar-border"
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="test-filter"
							className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
						>
							Filter (optional)
						</label>
						<input
							id="test-filter"
							type="text"
							placeholder="secure invoice"
							value={filter}
							onChange={(event) => setFilter(event.target.value)}
							className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-sidebar-border"
						/>
					</div>

					<button
						type="submit"
						disabled={isRunning}
						className="inline-flex h-10 items-center justify-center self-end rounded-lg border border-sidebar-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sidebar-border"
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
							<span
								className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
									result.status === "passed"
										? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
										: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
								}`}
							>
								{result.status} (exit {result.exit_code})
							</span>
						) : null}
					</div>

					{result ? (
						<pre className="max-h-112 overflow-auto rounded-lg bg-muted/50 p-3 text-xs whitespace-pre-wrap text-foreground">
							{result.output || "No output returned."}
						</pre>
					) : (
						<p className="text-sm text-muted-foreground">
							Run tests to see live output here.
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
