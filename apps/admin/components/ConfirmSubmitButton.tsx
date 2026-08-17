"use client";

export default function ConfirmSubmitButton({
  action,
  hiddenFields,
  confirmMessage,
  label,
  className,
}: {
  action: (formData: FormData) => void;
  hiddenFields: Record<string, string>;
  confirmMessage: string;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
