import { Suspense } from "react";

import Loading from "@/app/loading";
import TransactionList from "@/components/transactions/TransactionList";
import { getTransactions } from "@/lib/api/transactions/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function TransactionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Transactions</h1>
        </div>
        <Transactions />
      </div>
    </main>
  );
}

const Transactions = async () => {
  await checkAuth();

  const { transactions } = await getTransactions();
  
  return (
    <Suspense fallback={<Loading />}>
      <TransactionList transactions={transactions}  />
    </Suspense>
  );
};
