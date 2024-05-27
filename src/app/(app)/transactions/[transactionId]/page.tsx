import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTransactionById } from "@/lib/api/transactions/queries";
import OptimisticTransaction from "./OptimisticTransaction";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function TransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Transaction id={params.transactionId} />
    </main>
  );
}

const Transaction = async ({ id }: { id: string }) => {
  await checkAuth();

  const { transaction } = await getTransactionById(id);
  

  if (!transaction) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="transactions" />
        <OptimisticTransaction transaction={transaction}  />
      </div>
    </Suspense>
  );
};
