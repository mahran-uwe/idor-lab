import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { index as benchmarks } from "@/routes/benchmarks";

type ImplementationStats = {
	count: number;
	errors: number;
	mean_ms: number;
	median_ms: number;
	min_ms: number;
	max_ms: number;
	stddev_ms: number;
	p95_ms: number;
	p99_ms: number;
};

type BenchmarkResult = {
	pair: string;
	route_insecure: string;
	route_secure: string;
	insecure: ImplementationStats;
	secure: ImplementationStats;
};

type BenchmarkPayload = {
	generated_at: string;
	iterations: number;
	results: BenchmarkResult[];
};

type RunResult = {
	exit_code: number;
	status: "passed" | "failed";
	iterations: number;
	output: string;
};

type BenchmarksIndexProps = {
	benchmark?: BenchmarkPayload | null;
	runResult?: RunResult | null;
};

const metricKeys = ["mean_ms", "median_ms", "p95_ms", "p99_ms"] as const;

type MetricKey = (typeof metricKeys)[number];

const metricLabels: Record<MetricKey, string> = {
	mean_ms: "Mean",
	median_ms: "Median",
	p95_ms: "P95",
	p99_ms: "P99",
};

function formatMs(value: number): string {
	return `${value.toFixed(3)} ms`;
}

function formatDeltaPercent(insecure: number, secure: number): string {
	if (insecure === 0) {
		return "0.0%";
	}

	return `${(((secure - insecure) / insecure) * 100).toFixed(1)}%`;
}

function formatGeneratedAt(value: string): string {
	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(parsedDate);
}

export default function BenchmarksIndex({
	benchmark,
	runResult,
}: BenchmarksIndexProps) {
	const [isRunning, setIsRunning] = useState(false);
	const [iterations, setIterations] = useState<number>(
		benchmark?.iterations ?? 1000,
	);

	const maxLatency = useMemo(() => {
		if (!benchmark) {
			return 1;
		}

		const values = benchmark.results.flatMap((result) => [
			result.insecure.mean_ms,
			result.insecure.median_ms,
			result.insecure.p95_ms,
			result.insecure.p99_ms,
			result.secure.mean_ms,
			result.secure.median_ms,
			result.secure.p95_ms,
			result.secure.p99_ms,
		]);

		return Math.max(...values, 1);
	}, [benchmark]);

	const overheadRows = useMemo(() => {
		if (!benchmark) {
			return [] as {
				pair: string;
				deltaMean: number;
				deltaP95: number;
				deltaMeanText: string;
				deltaP95Text: string;
			}[];
		}

		return benchmark.results.map((result) => {
			const deltaMean = result.secure.mean_ms - result.insecure.mean_ms;
			const deltaP95 = result.secure.p95_ms - result.insecure.p95_ms;

			return {
				pair: result.pair,
				deltaMean,
				deltaP95,
				deltaMeanText: formatDeltaPercent(
					result.insecure.mean_ms,
					result.secure.mean_ms,
				),
				deltaP95Text: formatDeltaPercent(
					result.insecure.p95_ms,
					result.secure.p95_ms,
				),
			};
		});
	}, [benchmark]);

	const maxAbsoluteDelta = useMemo(() => {
		if (overheadRows.length === 0) {
			return 1;
		}

		const values = overheadRows.flatMap((row) => [
			Math.abs(row.deltaMean),
			Math.abs(row.deltaP95),
		]);

		return Math.max(...values, 1);
	}, [overheadRows]);

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsRunning(true);

		router.get(
			benchmarks.url(),
			{
				run: 1,
				iterations,
			},
			{
				preserveState: true,
				onFinish: () => setIsRunning(false),
			},
		);
	};

	return (
		<>
			<Head title="Benchmarks" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<h1 className="text-2xl font-bold tracking-tight">
							Benchmarks
						</h1>
						<p className="text-sm text-muted-foreground">
							Run authorization benchmark comparisons and visualize latency
							differences across insecure versus secure implementations.
						</p>
					</div>

					<form onSubmit={submit} className="flex items-end gap-2">
						<div className="space-y-1">
							<input
								id="iterations"
								type="number"
								min={10}
								max={1000}
								step={10}
								value={iterations}
								onChange={(event) => setIterations(Number(event.target.value))}
								className="h-10 w-28 rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm text-foreground outline-none ring-sidebar-ring transition focus:ring-2 dark:border-sidebar-border"
							/>
						</div>
						<button
							type="submit"
							disabled={isRunning}
							className="inline-flex h-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sidebar-border"
						>
							{isRunning ? "Running..." : "Run Benchmark"}
						</button>
					</form>
				</div>

				{runResult ? (
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<div className="flex flex-wrap items-center gap-3 text-sm">
							<span
								className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
									runResult.status === "passed"
										? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
										: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
								}`}
							>
								{runResult.status}
							</span>
							<span className="text-muted-foreground">
								Exit code {runResult.exit_code}
							</span>
							<span className="text-muted-foreground">
								{runResult.iterations} iterations
							</span>
						</div>
					</div>
				) : null}

				{benchmark ? (
					<>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Generated at
								</p>
								<p className="mt-2 text-2xl font-semibold text-foreground">
									{formatGeneratedAt(benchmark.generated_at)}
								</p>
							</div>
							<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Iterations
								</p>
								<p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
									{benchmark.iterations}
								</p>
							</div>
							<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Route pairs
								</p>
								<p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
									{benchmark.results.length}
								</p>
							</div>
						</div>

						<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
							<h2 className="text-base font-semibold text-foreground">
								Latency Profile
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Grouped bars compare insecure and secure latencies by pair for
								Mean, Median, P95, and P99.
							</p>

							<div className="mt-4 space-y-5">
								{benchmark.results.map((result) => (
									<div key={result.pair} className="space-y-3">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<h3 className="text-sm font-semibold text-foreground">
												{result.pair}
											</h3>
											<div className="text-xs text-muted-foreground">
												<span className="mr-3 inline-flex items-center gap-1">
													<span className="inline-block h-2 w-2 rounded bg-amber-500" />
													Insecure
												</span>
												<span className="inline-flex items-center gap-1">
													<span className="inline-block h-2 w-2 rounded bg-emerald-500" />
													Secure
												</span>
											</div>
										</div>

										<div className="space-y-2">
											{metricKeys.map((metric) => {
												const insecureValue = result.insecure[metric];
												const secureValue = result.secure[metric];

												return (
													<div
														key={`${result.pair}-${metric}`}
														className="space-y-1"
													>
														<div className="flex items-center justify-between text-xs text-muted-foreground">
															<span>{metricLabels[metric]}</span>
															<span>
																{formatMs(insecureValue)} /{" "}
																{formatMs(secureValue)}
															</span>
														</div>
														<div className="grid gap-1">
															<div className="h-2 rounded bg-muted/40">
																<div
																	className="h-2 rounded bg-amber-500/90"
																	style={{
																		width: `${Math.max((insecureValue / maxLatency) * 100, 1)}%`,
																	}}
																/>
															</div>
															<div className="h-2 rounded bg-muted/40">
																<div
																	className="h-2 rounded bg-emerald-500/90"
																	style={{
																		width: `${Math.max((secureValue / maxLatency) * 100, 1)}%`,
																	}}
																/>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
							<h2 className="text-base font-semibold text-foreground">
								Security Overhead
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Bars show secure minus insecure latency deltas in milliseconds.
								Positive values indicate extra secure-path overhead.
							</p>

							<div className="mt-4 space-y-3">
								{overheadRows.map((row) => (
									<div
										key={row.pair}
										className="rounded-lg border border-sidebar-border/70 p-3 dark:border-sidebar-border"
									>
										<h3 className="text-sm font-semibold text-foreground">
											{row.pair}
										</h3>
										<div className="mt-2 space-y-2 text-xs">
											{[
												{
													label: "Mean",
													delta: row.deltaMean,
													text: row.deltaMeanText,
												},
												{
													label: "P95",
													delta: row.deltaP95,
													text: row.deltaP95Text,
												},
											].map((item) => {
												const width = Math.max(
													(Math.abs(item.delta) / maxAbsoluteDelta) * 100,
													1,
												);

												return (
													<div key={`${row.pair}-${item.label}`}>
														<div className="mb-1 flex items-center justify-between text-muted-foreground">
															<span>{item.label}</span>
															<span>
																{item.delta >= 0 ? "+" : ""}
																{formatMs(item.delta)} ({item.text})
															</span>
														</div>
														<div className="h-2 rounded bg-muted/40">
															<div
																className={`h-2 rounded ${
																	item.delta >= 0
																		? "bg-sky-500/90"
																		: "bg-violet-500/90"
																}`}
																style={{ width: `${width}%` }}
															/>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
							<div className="overflow-x-auto">
								<table className="w-full min-w-245 text-sm">
									<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
										<tr>
											<th className="px-4 py-3">Pair</th>
											<th className="px-4 py-3">Impl</th>
											<th className="px-4 py-3">N</th>
											<th className="px-4 py-3">Errors</th>
											<th className="px-4 py-3">Mean</th>
											<th className="px-4 py-3">Median</th>
											<th className="px-4 py-3">Min</th>
											<th className="px-4 py-3">Max</th>
											<th className="px-4 py-3">StdDev</th>
											<th className="px-4 py-3">P95</th>
											<th className="px-4 py-3">P99</th>
										</tr>
									</thead>
									<tbody>
										{benchmark.results.flatMap((result) =>
											(["insecure", "secure"] as const).map(
												(implementation) => {
													const stats = result[implementation];
													const implLabel = implementation.toUpperCase();

													return (
														<tr
															key={`${result.pair}-${implementation}`}
															className="border-t border-sidebar-border/70 dark:border-sidebar-border"
														>
															<td className="px-4 py-3 font-medium text-foreground">
																{result.pair}
															</td>
															<td className="px-4 py-3">
																<span
																	className={`rounded px-2 py-1 text-xs font-semibold ${
																		implementation === "insecure"
																			? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
																			: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
																	}`}
																>
																	{implLabel}
																</span>
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{stats.count}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{stats.errors}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.mean_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.median_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.min_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.max_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.stddev_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.p95_ms)}
															</td>
															<td className="px-4 py-3 tabular-nums text-foreground">
																{formatMs(stats.p99_ms)}
															</td>
														</tr>
													);
												},
											),
										)}
									</tbody>
								</table>
							</div>
						</div>
					</>
				) : (
					<div className="rounded-xl border border-dashed border-sidebar-border/70 bg-background/50 p-10 text-center dark:border-sidebar-border">
						<p className="text-sm text-muted-foreground">
							No benchmark data found yet. Run the benchmark to generate and
							visualize results.
						</p>
					</div>
				)}
			</div>
		</>
	);
}

BenchmarksIndex.layout = {
	breadcrumbs: [
		{
			title: "Benchmarks",
			href: benchmarks(),
		},
	],
};
