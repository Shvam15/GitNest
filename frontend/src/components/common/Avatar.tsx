import { cn } from "@/lib/utils";

const palette = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-cyan-500 to-sky-500",
];

export function Avatar({ initials, size = 32, className }: { initials: string; size?: number; className?: string }) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % palette.length;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold ring-1 ring-white/10",
        palette[idx],
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
