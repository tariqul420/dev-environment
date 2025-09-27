export default function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-500 dark:text-green-400";
    case "cancelled":
      return "bg-red-500/10 text-red-500 dark:text-red-400";
    case "processing":
      return "bg-blue-500/10 text-blue-500 dark:text-blue-400";
    case "shipped":
      return "bg-purple-500/10 text-purple-500 dark:text-purple-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}
