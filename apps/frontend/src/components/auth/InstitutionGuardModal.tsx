"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface InstitutionGuardModalProps {
    open: boolean;
    onClose: () => void;
    onRedirect?: () => void;
}

export function InstitutionGuardModal({ open, onClose, onRedirect }: InstitutionGuardModalProps) {
    return (
        <Modal isOpen={open} onClose={onClose} title="Institution-only feature">
            <p className="text-sm text-text-secondary">
                Permissioned markets and RWA pools are available only to verified institutions. You can register your institution from the entry screen to unlock these capabilities.
            </p>
            <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" size="sm" onClick={onClose}>
                    Maybe Later
                </Button>
                <Button
                    size="sm"
                    onClick={() => {
                        onClose();
                        onRedirect?.();
                    }}
                >
                    Go to Institution Registration
                </Button>
            </div>
        </Modal>
    );
}


