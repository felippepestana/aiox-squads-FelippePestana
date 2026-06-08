// AIOX Design System — entrypoint público.

export { cn } from "./lib/cn";

// Primitivos (shadcn-style)
export { Button, buttonVariants, type ButtonProps } from "./components/ui/button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Badge, badgeVariants, type BadgeProps } from "./components/ui/badge";
export { Input, type InputProps } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { Progress } from "./components/ui/progress";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/ui/tooltip";
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export { Separator } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "./components/ui/toast";
export { Toaster } from "./components/ui/toaster";
export { useToast, toast } from "./components/ui/use-toast";

// Componentes de experiência de agente
export { AppShell } from "./components/agent/app-shell";
export { PageHeader } from "./components/agent/page-header";
export { StatCard } from "./components/agent/stat-card";
export { StatusBadge, type AnalysisStatus } from "./components/agent/status-badge";
export { EmptyState } from "./components/agent/empty-state";
export {
  FileDropzone,
  type DropzoneFile,
} from "./components/agent/file-dropzone";
export {
  PipelineStepper,
  AGENT_PIPELINE_STEPS,
  type PipelineStep,
} from "./components/agent/pipeline-stepper";
export { ThemeToggle, useTheme, themeInitScript } from "./components/agent/theme";
export { PartiesSection, type Party } from "./components/agent/parties-section";
export {
  TimelineSection,
  type TimelineEvent,
} from "./components/agent/timeline-section";
export { ClaimsSection, type Claim } from "./components/agent/claims-section";
export { RiskList, type RiskItem } from "./components/agent/risk-list";
export {
  DeadlineCard,
  type DeadlineItem,
} from "./components/agent/deadline-card";
