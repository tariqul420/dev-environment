import { Badge } from "@/components/ui/badge";

function TimeCell({ createdAt }: { createdAt: string | Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const created = new Date(createdAt);
  const hoursAgo = differenceInHours(now, created);

  const displayText =
    hoursAgo < 24
      ? formatDistanceToNowStrict(created, { addSuffix: true })
      : format(created, "PPP");

  return (
    <div className="w-32">
      <Badge variant="outline" className="rounded px-1.5 py-1">
        {displayText}
      </Badge>
    </div>
  );
}