import { User, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CustomerProfile {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  role: string;
  createdAt: Date;
  totalSpent?: string;
}

interface CustomerProfileCardProps {
  profile: CustomerProfile;
}

export default function CustomerProfileCard({ profile }: CustomerProfileCardProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          আমার প্রোফাইল
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{profile.name || "নাম নেই"}</h3>
            <Badge variant="secondary">{profile.role === "USER" ? "কাস্টমার" : profile.role}</Badge>
          </div>
        </div>

        <div className="grid gap-3">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
          )}
          
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>সদস্য হয়েছেন: {formatDate(profile.createdAt)}</span>
          </div>
        </div>

        {profile.totalSpent && (
          <div className="pt-3 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">মোট খরচ</p>
              <p className="text-2xl font-bold text-primary">{profile.totalSpent} ৳</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}