import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashPayload = {
    toast?: FlashToast;
    success?: string | null;
    error?: string | null;
    info?: string | null;
    warning?: string | null;
    message?: string | null;
};

function toastFromPayload(payload: FlashPayload | undefined): void {
    if (!payload) {
        return;
    }

    const messages: Array<{ type: FlashToast['type']; message: string }> = [];

    if (payload.toast?.message) {
        messages.push({ type: payload.toast.type, message: payload.toast.message });
    }

    if (payload.success) {
        messages.push({ type: 'success', message: payload.success });
    }

    if (payload.error) {
        messages.push({ type: 'error', message: payload.error });
    }

    if (payload.warning) {
        messages.push({ type: 'warning', message: payload.warning });
    }

    if (payload.info) {
        messages.push({ type: 'info', message: payload.info });
    }

    if (payload.message) {
        messages.push({ type: 'info', message: payload.message });
    }

    const seenInPayload = new Set<string>();

    for (const item of messages) {
        const signature = `${item.type}:${item.message}`;

        if (seenInPayload.has(signature)) {
            continue;
        }

        seenInPayload.add(signature);
        toast[item.type](item.message);
    }
}

export function useFlashToast(): void {
    useEffect(() => {
        const offFlash = router.on('flash', (event) => {
            const payload = (event as CustomEvent<{ flash?: FlashPayload }>).detail?.flash;
            toastFromPayload(payload);
        });

        // Capture flash values that arrive in page props after redirects.
        const offSuccess = router.on('success', (event) => {
            const payload = (event as CustomEvent<{ page?: { props?: { flash?: FlashPayload } } }>).detail?.page?.props?.flash;
            toastFromPayload(payload);
        });

        return () => {
            offFlash();
            offSuccess();
        };
    }, []);
}
