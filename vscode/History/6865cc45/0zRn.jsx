

import PaymentForm from '@/components/dashboard/admin/payment-from';
import { BreadcrumbContainer } from '@/components/globals/breadcrumb-container';
import React from 'react';

const Page = () => {
  return (
    <div className="container mx-auto max-w-4xl overflow-hidden">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Add payment" },
        ]}
      />
      <PaymentForm/>
    </div>
  );
};

export default Page;
