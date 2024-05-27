import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type TransactionId, transactionIdSchema } from "@/lib/db/schema/transactions";

export const getTransactions = async () => {
  const { session } = await getUserAuth();
  const t = await db.transaction.findMany({ where: {userId: session?.user.id!}});
  return { transactions: t };
};

export const getTransactionById = async (id: TransactionId) => {
  const { session } = await getUserAuth();
  const { id: transactionId } = transactionIdSchema.parse({ id });
  const t = await db.transaction.findFirst({
    where: { id: transactionId, userId: session?.user.id!}});
  return { transaction: t };
};


