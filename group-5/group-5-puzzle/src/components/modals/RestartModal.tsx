"use client";

import { ConfirmModal } from "./ConfirmModal"; export function RestartModal(props: { onCancel: () => void; onConfirm: () => void }) { return <ConfirmModal title="Restart puzzle?" body="Your current puzzle progress will be lost. The investigation timer will continue." action="Restart" {...props}/>; }
