import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceById } from "@/lib/actions/service.action";
import Link from "next/link";

import ServiceStatus from "@/components/dashboard/admin/service-status";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  ClipboardCheck,
  ExternalLink,
  FileSearch,
  FileText,
  FlaskConical,
  IdCard,
  Landmark,
  Mail,
  Phone,
  Shield,
  Stamp,
  Ticket,
  User,
} from "lucide-react";

export default async function Page({ params }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Service not found</AlertTitle>
          <AlertDescription>
            The requested service could not be located.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const {
    certificate,
    nid,
    drivingLicence,
    utilityBill,
    medicalReport,
    doopTestReport,
    visa,
    passport,
    ticket,
    name,
    referenceHolder,
    phone,
    email,
    dlReferenceNumber,
    dlDateOfBirth,
    nidDateOfBirth,
    typesOfWork,
    workingCondition,
    paymentStatus,
    agreementOfAmount,
    createdAt,
    updatedAt,
  } = service;

  const StatusBadge = ({ status }) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed")
      return (
        <Badge className={"capitalize"}>
          <BadgeCheck className="mr-1 h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    if (s === "processing") return <Badge variant="secondary">{status}</Badge>;
    if (s === "unpaid" || s === "cancelled")
      return <Badge variant="destructive">{status}</Badge>;
    return <Badge variant="outline">{status ?? "N/A"}</Badge>;
  };

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className={highlight ? "bg-muted/50 rounded-md p-2" : ""}>
      <div className="flex items-start justify-between gap-4 py-2">
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
        <span className="text-right text-sm font-medium">{value ?? "N/A"}</span>
      </div>
    </div>
  );

  const DocumentItem = ({ label, url, icon }) => {
    if (!url) return null;
    return (
      <Card className="transition-all hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-medium">{label}</div>
            <Button asChild variant="link" className="h-auto p-0">
              <a href={url} target="_blank" rel="noopener noreferrer">
                View document <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MetaChip = ({ icon: Icon, label }) => (
    <span className="text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );

  const WorkBadges = () => {
    if (!typesOfWork) return <span className="text-sm font-medium">N/A</span>;
    const items = Array.isArray(typesOfWork)
      ? typesOfWork
      : String(typesOfWork).split(",");
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((w, i) => (
          <Badge key={i} variant="secondary" className="font-normal">
            {String(w).trim()}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Service Details
              </h1>
              <p className="text-muted-foreground text-sm">
                Complete information for {name ?? "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {phone ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`tel:${phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Link>
                </Button>
              ) : null}
              {email ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`mailto:${email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Link>
                </Button>
              ) : null}
              <StatusBadge status={paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="text-primary h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Full Name" value={name} highlight />
                <InfoRow label="Phone" value={phone} />
                <InfoRow label="Email" value={email} />
                <InfoRow label="Reference Holder" value={referenceHolder} />
              </CardContent>
            </Card>

            {/* Work */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="text-primary h-5 w-5" />
                  Work & Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-muted/50 rounded-md p-2">
                  <div className="flex items-start justify-between gap-4 py-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      Types of Work
                    </span>
                    <div className="text-right">
                      <WorkBadges />
                    </div>
                  </div>
                </div>

                <InfoRow label="Working Condition" value={workingCondition} />
                <InfoRow
                  label="Agreed Amount"
                  value={agreementOfAmount}
                  highlight
                />
              </CardContent>
            </Card>

            {/* License & ID */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-primary h-5 w-5" />
                  License & ID Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow
                  label="DL Reference Number"
                  value={dlReferenceNumber}
                />
                <InfoRow
                  label="DL Date of Birth"
                  value={
                    dlDateOfBirth
                      ? new Date(dlDateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoRow
                  label="NID Date of Birth"
                  value={
                    nidDateOfBirth
                      ? new Date(nidDateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                />
              </CardContent>
            </Card>

            {/* System */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="text-primary h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow
                  label="Created At"
                  value={
                    createdAt ? new Date(createdAt).toLocaleString() : "N/A"
                  }
                />
                <InfoRow
                  label="Updated At"
                  value={
                    updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"
                  }
                />
              </CardContent>
            </Card>

            <ServiceStatus id={service._id} status={service.status} />
          </div>

          {/* Right: Documents (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DocumentItem
                  label="Certificate"
                  url={certificate}
                  icon={<ClipboardCheck className="h-5 w-5" />}
                />
                <DocumentItem
                  label="National ID"
                  url={nid}
                  icon={<IdCard className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Driving License"
                  url={drivingLicence}
                  icon={<Landmark className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Utility Bill"
                  url={utilityBill}
                  icon={<FileSearch className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Medical Report"
                  url={medicalReport}
                  icon={<FlaskConical className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Drug Test Report"
                  url={doopTestReport}
                  icon={<Stamp className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Visa"
                  url={visa}
                  icon={<Stamp className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Passport"
                  url={passport}
                  icon={<IdCard className="h-5 w-5" />}
                />
                <DocumentItem
                  label="Ticket"
                  url={ticket}
                  icon={<Ticket className="h-5 w-5" />}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
