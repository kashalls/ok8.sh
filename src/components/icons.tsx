import { Icon, type IconifyIcon } from "@iconify/react";
import { type ComponentType } from "react";

type IconProps = { className?: string };

/**
 * Creates a React component from an Iconify icon name.
 * Works as a drop-in replacement for lucide-react components.
 */
function createIcon(name: string): ComponentType<IconProps> {
  const IconComponent = ({ className }: IconProps) => (
    <Icon icon={name} className={className} />
  );
  IconComponent.displayName = name;
  return IconComponent;
}

// ── Brand icons ──────────────────────────────────────────────
export const GithubIcon = createIcon("simple-icons:github");
export const LinkedinIcon = createIcon("simple-icons:linkedin");
export const MastodonIcon = createIcon("simple-icons:mastodon");

// ── General icons (replaces lucide-react) ────────────────────
export const BookOpen = createIcon("lucide:book-open");
export const ArrowRight = createIcon("lucide:arrow-right");
export const Menu = createIcon("lucide:menu");
export const X = createIcon("lucide:x");
export const Activity = createIcon("lucide:activity");
export const GitBranch = createIcon("lucide:git-branch");
export const Eye = createIcon("lucide:eye");
export const Lock = createIcon("lucide:lock");
export const Workflow = createIcon("lucide:workflow");
export const HardDrive = createIcon("lucide:hard-drive");
export const Globe = createIcon("lucide:globe");
export const Cpu = createIcon("lucide:cpu");
export const Server = createIcon("lucide:server");
export const Box = createIcon("lucide:box");
export const Zap = createIcon("lucide:zap");
export const Clock = createIcon("lucide:clock");
export const Calendar = createIcon("lucide:calendar");
export const ArrowUpFromLine = createIcon("lucide:arrow-up-from-line");
export const ArrowDownToLine = createIcon("lucide:arrow-down-to-line");
export const AlertTriangle = createIcon("lucide:triangle-alert");
export const Shield = createIcon("lucide:shield");
export const Container = createIcon("lucide:container");
