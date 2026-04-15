interface LiveLoadTimeProps {
	isLoading: boolean;
	loadDurationMs: number | null;
}

function formatDuration(loadDurationMs: number): string {
	if (loadDurationMs < 1000) {
		return `${Math.round(loadDurationMs)} ms`;
	}

	return `${(loadDurationMs / 1000).toFixed(2)} s`;
}

export function LiveLoadTime({ isLoading, loadDurationMs }: LiveLoadTimeProps) {
	if (!isLoading && loadDurationMs === null) {
		return null;
	}

	return (
		<div className="inline-flex items-center rounded-full border border-sidebar-border/70 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground dark:border-sidebar-border">
			{isLoading
				? "Loading preview..."
				: `Loaded in ${formatDuration(loadDurationMs ?? 0)}`}
		</div>
	);
}
