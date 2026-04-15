import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { LiveLoadTime } from "@/components/live-load-time";
import type { AccessDemoItem, DemoOwner } from "@/lib/access-demo";

interface AccessDemoColumnProps {
	type: "insecure" | "secure";
	title: string;
	description: string;
	items: AccessDemoItem[];
	accent: string;
	resourceLabelPlural: string;
	prioritizeOwner?: DemoOwner | null;
	previewAreaTitle: string;
	previewHint: string;
}

export function AccessDemoColumn({
	type,
	title,
	description,
	items,
	accent,
	resourceLabelPlural,
	prioritizeOwner,
	previewAreaTitle,
	previewHint,
}: AccessDemoColumnProps) {
	const [selectedId, setSelectedId] = useState<number | null>(
		items[0]?.id ?? null,
	);
	const initialPreviewUrl = items[0]?.previewUrl ?? "#";
	const hasInitialPreview = initialPreviewUrl !== "#";
	const [manualUrlInputValue, setManualUrlInputValue] = useState<string | null>(
		null,
	);
	const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(
		hasInitialPreview ? initialPreviewUrl : null,
	);
	const [loadStartedAt, setLoadStartedAt] = useState<number | null>(null);
	const [loadDurationMs, setLoadDurationMs] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const selectedItem = useMemo(
		() => items.find((item) => item.id === selectedId) ?? items[0],
		[items, selectedId],
	);

	const urlInputValue = manualUrlInputValue ?? selectedItem?.url ?? "";
	const activePreviewUrl = manualPreviewUrl ?? selectedItem?.previewUrl ?? "#";

	const startPreviewLoad = (
		nextPreviewUrl: string,
		startedAt: number | null,
	) => {
		const normalizedPreviewUrl = nextPreviewUrl.trim() || "#";

		setManualPreviewUrl(normalizedPreviewUrl);

		if (normalizedPreviewUrl === "#") {
			setIsLoading(false);
			setLoadStartedAt(null);
			setLoadDurationMs(null);

			return;
		}

		setLoadStartedAt(startedAt);
		setLoadDurationMs(null);
		setIsLoading(startedAt !== null);
	};

	const applyUrlToPreview = (startedAt: number | null) => {
		startPreviewLoad(urlInputValue, startedAt);
	};

	const groupedByOwner = useMemo(
		() => ({
			userA: items.filter((item) => item.owner === "User A"),
			userB: items.filter((item) => item.owner === "User B"),
		}),
		[items],
	);

	const ownerSections = useMemo(() => {
		const sections = [
			{ owner: "User A" as const, items: groupedByOwner.userA },
			{ owner: "User B" as const, items: groupedByOwner.userB },
		];

		if (!prioritizeOwner) {
			return sections.map((section) => ({
				...section,
				heading: `${section.owner} ${resourceLabelPlural}`,
			}));
		}

		const ordered = sections.sort((left, right) => {
			if (left.owner === prioritizeOwner) {
				return -1;
			}

			if (right.owner === prioritizeOwner) {
				return 1;
			}

			return 0;
		});

		return ordered.map((section) => ({
			...section,
			heading:
				section.owner === prioritizeOwner
					? `My ${resourceLabelPlural}`
					: `${section.owner} ${resourceLabelPlural}`,
		}));
	}, [
		groupedByOwner.userA,
		groupedByOwner.userB,
		prioritizeOwner,
		resourceLabelPlural,
	]);

	const normalizedTitle = title.replace(/\s+/g, "-").toLowerCase();
	const isSecure = type === "secure";
	const TypeIcon = isSecure ? ShieldCheck : AlertTriangle;
	const titleIconClassName = isSecure
		? "text-emerald-700 dark:text-emerald-300"
		: "text-amber-700 dark:text-amber-300";
	const sectionBorderClassName = isSecure
		? "border-emerald-300/80 dark:border-emerald-800/70"
		: "border-amber-300/80 dark:border-amber-800/70";

	return (
		<section
			className={`flex min-h-170 flex-col gap-4 rounded-2xl border bg-background/95 p-4 shadow-sm ${sectionBorderClassName}`}
		>
			<div className="space-y-1">
				<h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
					<TypeIcon
						className={`size-5 ${titleIconClassName}`}
						aria-hidden="true"
					/>
					<span>{title}</span>
				</h2>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{ownerSections.map((section) => (
					<div
						key={section.owner}
						className="space-y-2 rounded-xl border border-sidebar-border/70 p-3 dark:border-sidebar-border"
					>
						<div className="flex items-center gap-2">
							<h3 className="text-xs font-semibold tracking-wide uppercase">
								{section.heading}
							</h3>
							{prioritizeOwner && section.owner !== prioritizeOwner ? (
								<span className="text-xs font-semibold tracking-wide uppercase text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/80 px-1 rounded">
									Demo
								</span>
							) : null}
						</div>
						{section.items.length > 0 ? (
							section.items.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={(event) => {
										setSelectedId(item.id);
										setManualUrlInputValue(item.url);
										startPreviewLoad(item.previewUrl, event.timeStamp);
									}}
									className="block text-left text-sm text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
								>
									{item.label}
								</button>
							))
						) : (
							<p className="text-sm text-muted-foreground">
								No {resourceLabelPlural.toLowerCase()}.
							</p>
						)}
					</div>
				))}
			</div>

			<div className="space-y-2">
				<label
					htmlFor={`${normalizedTitle}-url`}
					className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
				>
					URL
				</label>
				<div className="flex items-center gap-2">
					<input
						id={`${normalizedTitle}-url`}
						type="text"
						value={urlInputValue}
						onChange={(event) => {
							setManualUrlInputValue(event.target.value);
						}}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								applyUrlToPreview(event.timeStamp);
							}
						}}
						className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-sidebar-border"
					/>
					<button
						type="button"
						onClick={(event) => {
							applyUrlToPreview(event.timeStamp);
						}}
						className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 dark:border-sidebar-border"
					>
						<ArrowRight className="size-4" aria-hidden="true" />
						<span className="sr-only">Go</span>
					</button>
				</div>
			</div>

			<div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/20 dark:border-sidebar-border">
				<div className="absolute top-2 right-2 z-10">
					<LiveLoadTime isLoading={isLoading} loadDurationMs={loadDurationMs} />
				</div>
				{selectedItem && activePreviewUrl !== "#" ? (
					<iframe
						src={activePreviewUrl}
						title={`${selectedItem.label} preview`}
						className="h-full min-h-80 w-full"
						onLoad={(event) => {
							if (loadStartedAt === null) {
								setIsLoading(false);

								return;
							}

							setLoadDurationMs(event.timeStamp - loadStartedAt);
							setLoadStartedAt(null);
							setIsLoading(false);
						}}
					/>
				) : (
					<div className="flex h-full min-h-80 items-center justify-center p-6">
						<div className="max-w-sm rounded-xl border border-dashed border-sidebar-border/70 bg-background/80 p-4 text-center dark:border-sidebar-border">
							<p className={`text-sm font-medium ${accent}`}>
								{previewAreaTitle}
							</p>
							<p className="mt-2 text-xs text-muted-foreground">
								Selected: {selectedItem?.label}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{previewHint}
							</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
