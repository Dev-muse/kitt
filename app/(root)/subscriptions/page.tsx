"use client";

import { PricingTable } from "@clerk/nextjs";

const SubscriptionsPage = () => {
  return (
    <main className="clerk-subscriptions">
      <div className="w-full max-w-4xl mx-auto text-center mb-10">
        <h1 className="page-title-xl mb-4">Choose Your Plan</h1>
        <p className="subtitle max-w-2xl mx-auto">
          Unlock the full power of your AI book companion. Upgrade to access
          more books, longer voice sessions, and session history.
        </p>
      </div>

      <div className="clerk-pricing-table-wrapper w-full max-w-5xl mx-auto">
        <PricingTable />
      </div>
    </main>
  );
};

export default SubscriptionsPage;
