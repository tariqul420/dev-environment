export default function useStatusIcon() {
  switch (row.original.status) {
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
