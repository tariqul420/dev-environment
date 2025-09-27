export default function FeaturesCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow hover:shadow-lg transition-shadow cursor-default">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}
