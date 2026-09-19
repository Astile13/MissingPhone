"use client";

import { ConfirmModal } from "./ConfirmModal"; export function ExitModal(props: { onCancel: () => void; onConfirm: () => void }) { return <ConfirmModal title="Exit game?" body="Your current investigation will be discarded and no result will be recorded." action="Exit game" {...props}/>; }
