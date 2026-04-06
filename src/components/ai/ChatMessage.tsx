export function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${role === "user" ? "ml-auto bg-primary text-white" : "bg-bg text-text-primary"}`}
    >
      {content}
    </div>
  );
}
