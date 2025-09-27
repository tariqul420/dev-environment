const DashboardLayout = ({ children }) => {
  return (
    <main className="flex-1">
      <div className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
