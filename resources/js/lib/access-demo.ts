export type DemoOwner = "User A" | "User B";

export type AccessDemoItem = {
	id: number;
	label: string;
	owner: DemoOwner;
	url: string;
	previewUrl: string;
};

export function ownerFromUserId(userId: number): DemoOwner | null {
	if (userId === 1) {
		return "User A";
	}

	if (userId === 2) {
		return "User B";
	}

	return null;
}
