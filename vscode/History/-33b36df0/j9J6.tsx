import {
  IconCircleCheckFilled,
  IconLoader,
  IconPackage,
  IconTruck,
  IconX,
} from "@tabler/icons-react";

export default function useStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <IconCircleCheckFilled className="mr-1 h-4 w-4" />;
    case "cancelled":
      return <IconX className="mr-1 h-4 w-4" />;
    case "processing":
      return <IconPackage className="mr-1 h-4 w-4" />;
    case "shipped":
      return <IconTruck className="mr-1 h-4 w-4" />;
    default:
      return <IconLoader className="mr-1 h-4 w-4" />;
  }
}
