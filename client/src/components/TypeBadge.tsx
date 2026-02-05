import { Calendar, ShoppingCart, Clock } from "lucide-react";
import type { RequestType } from "@/types/request";

interface TypeBadgeProps {
  type: RequestType;
}

const typeConfig = {
  purchase: {
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-600",
  },
  leave: {
    icon: Calendar,
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-600",
  },
  overtime: {
    icon: Clock,
    color: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-600",
  },
};

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}
    >
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const getTypeIcon = (type: RequestType) => {
  const config = typeConfig[type];
  const Icon = config.icon;
  return <Icon className={`w-4 h-4 ${config.iconColor}`} />;
};
