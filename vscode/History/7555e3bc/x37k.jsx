import { getServiceById } from "@/lib/actions/service.action";

export default async function Page({ params }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center from-gray-50 to-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Service Not Found
          </h2>
          <p className="text-gray-600">
            The requested service could not be located.
          </p>
        </div>
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

  const DocumentCard = ({ label, url, icon }) => {
    if (!url) return null;

    return (
      <div className="group relative rounded-xl border border-gray-100 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
              {label}
            </h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-600"
            >
              View Document
              <svg
                className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const InfoCard = ({ title, children, icon }) => (
    <div className="rounded-xl border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, highlight = false }) => (
    <div
      className={`flex items-start justify-between border-b border-gray-50 py-2 last:border-b-0 ${highlight ? "-mx-2 rounded-lg bg-gray-50 px-2" : ""}`}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span
        className={`text-right font-medium text-gray-900 ${highlight ? "text-indigo-600" : ""}`}
      >
        {value || "N/A"}
      </span>
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status?.toLowerCase()] || "border-gray-200 bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  const documents = [
    {
      label: "Certificate",
      url: certificate,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
    {
      label: "National ID",
      url: nid,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
          />
        </svg>
      ),
    },
    {
      label: "Driving License",
      url: drivingLicence,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Utility Bill",
      url: utilityBill,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Medical Report",
      url: medicalReport,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      label: "Drug Test Report",
      url: doopTestReport,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      label: "Visa",
      url: visa,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      label: "Passport",
      url: passport,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      label: "Ticket",
      url: ticket,
      icon: (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-2-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-gray-900">
                Service Details
              </h1>
              <p className="text-gray-600">Complete information for {name}</p>
            </div>
            <div className="text-right">
              <div className="mb-1 text-sm text-gray-500">Payment Status</div>
              {getStatusBadge(paymentStatus)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Personal Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Details */}
            <InfoCard
              title="Personal Information"
              icon={
                <svg
                  className="h-5 w-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            >
              <InfoRow label="Full Name" value={name} highlight />
              <InfoRow label="Phone" value={phone} />
              <InfoRow label="Email" value={email} />
              <InfoRow label="Reference Holder" value={referenceHolder} />
            </InfoCard>

            {/* Work Information */}
            <InfoCard
              title="Work & Employment"
              icon={
                <svg
                  className="h-5 w-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                  />
                </svg>
              }
            >
              <InfoRow
                label="Types of Work"
                value={
                  Array.isArray(typesOfWork)
                    ? typesOfWork.join(", ")
                    : typesOfWork
                }
                highlight
              />
              <InfoRow label="Working Condition" value={workingCondition} />
              <InfoRow
                label="Agreed Amount"
                value={agreementOfAmount}
                highlight
              />
            </InfoCard>

            {/* License & ID Information */}
            <InfoCard
              title="License & ID Details"
              icon={
                <svg
                  className="h-5 w-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0"
                  />
                </svg>
              }
            >
              <InfoRow label="DL Reference Number" value={dlReferenceNumber} />
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
            </InfoCard>

            {/* System Information */}
            <InfoCard
              title="System Information"
              icon={
                <svg
                  className="h-5 w-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              <InfoRow
                label="Created At"
                value={new Date(createdAt).toLocaleString()}
              />
              <InfoRow
                label="Updated At"
                value={new Date(updatedAt).toLocaleString()}
              />
            </InfoCard>
          </div>

          {/* Right Column - Documents */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Documents
                </h2>
              </div>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <DocumentCard key={index} {...doc} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
