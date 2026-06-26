"use client";

import { MoreVertical, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { updateTenantStatus, deleteTenant } from "../actions";

interface DropdownPos {
  top: number;
  right?: number;
  left?: number;
}

export function RowActionsMenu({
  tenant,
  onRefetch,
}: {
  tenant: any;
  onRefetch: () => void;
}) {
  const t = useTranslations("OwnerAccounts");
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({
    top: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const isRTL = document.documentElement.dir === "rtl";

      setDropdownPos({
        // fixed positioning is viewport-relative, so use rect.bottom exactly
        top: rect.bottom + 4,
        ...(isRTL
          ? { left: rect.left } // In RTL, align left edge of dropdown with left edge of button (expands to the right)
          : { right: viewportWidth - rect.right }), // In LTR, align right edge of dropdown with right edge of button (expands to the left)
      });
    }
  }, [isOpen]);

  // Close on scroll so the menu doesn't float away
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [isOpen]);

  const handleStatusChange = async (newStatus: string) => {
    setIsOpen(false);
    setIsProcessing(true);
    try {
      await updateTenantStatus(tenant.id, newStatus as any);
      onRefetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteTenant(tenant.id);
      setShowDeleteModal(false);
      onRefetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const dropdown = isOpen
    ? createPortal(
        <>
          {/* Invisible backdrop */}
          <div
            className='fixed inset-0 z-[9998]'
            onClick={() => setIsOpen(false)}
          />

          {/*
           * Uses `right` (not `left`) so the menu's right edge aligns with
           * the button's right edge in both RTL and LTR layouts.
           * No transform needed — `right` positioning does the job cleanly.
           */}
          <div
            className='fixed z-[9999] w-48 rounded-md border border-border bg-surface-1 py-1 shadow-lg'
            style={{
              top: dropdownPos.top,
              ...(dropdownPos.left !== undefined ? { left: dropdownPos.left } : {}),
              ...(dropdownPos.right !== undefined ? { right: dropdownPos.right } : {}),
            }}
          >
            {tenant.status !== "ACTIVE" && (
              <button
                onClick={() => handleStatusChange("ACTIVE")}
                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-status-success hover:bg-surface-2'
              >
                <CheckCircle2 className='h-4 w-4 shrink-0' />
                <span>{t("activate_account")}</span>
              </button>
            )}
            {tenant.status !== "SUSPENDED" && (
              <button
                onClick={() => handleStatusChange("SUSPENDED")}
                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-status-warning hover:bg-surface-2'
              >
                <XCircle className='h-4 w-4 shrink-0' />
                <span>{t("suspend_account")}</span>
              </button>
            )}
            <div className='h-px w-full bg-border my-1' />
            <button
              onClick={() => {
                setIsOpen(false);
                setShowDeleteModal(true);
              }}
              className='flex w-full items-center gap-2 px-4 py-2 text-sm text-status-danger hover:bg-status-danger-bg'
            >
              <Trash2 className='h-4 w-4 shrink-0' />
              <span>{t("hard_delete")}</span>
            </button>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <div className='inline-block'>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={isProcessing}
          className='p-1.5 rounded-md hover:bg-surface-2 text-txt-muted hover:text-txt-primary transition-colors disabled:opacity-50'
        >
          <MoreVertical className='h-5 w-5' />
        </button>
      </div>

      {dropdown}

      {/* Delete confirmation modal */}
      {showDeleteModal &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setShowDeleteModal(false)}
            />
            <div className='relative z-10 w-full max-w-md rounded-xl bg-surface-1 p-6 shadow-xl border border-border'>
              <h3 className='text-xl font-bold text-txt-primary mb-2'>
                {t("confirm_delete_title")}
              </h3>
              <p className='text-sm text-txt-secondary mb-6'>
                {t("confirm_delete_desc", { name: tenant.name })}
              </p>
              <div className='flex items-center justify-end gap-3'>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isProcessing}
                  className='px-4 py-2 rounded-lg text-sm font-medium text-txt-primary hover:bg-surface-2 transition-colors disabled:opacity-50'
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className='px-4 py-2 rounded-lg text-sm font-medium bg-status-danger text-white hover:bg-status-danger/90 transition-colors disabled:opacity-50'
                >
                  {t("yes_delete")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
