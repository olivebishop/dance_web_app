import { db } from "@/lib/db/index";
import { 
  TransactionId, 
  NewTransactionParams,
  UpdateTransactionParams, 
  updateTransactionSchema,
  insertTransactionSchema, 
  transactionIdSchema 
} from "@/lib/db/schema/transactions";
import { getUserAuth } from "@/lib/auth/utils";

export const createTransaction = async (transaction: NewTransactionParams) => {
  const { session } = await getUserAuth();
  const newTransaction = insertTransactionSchema.parse({ ...transaction, userId: session?.user.id! });
  try {
    const t = await db.transaction.create({ data: newTransaction });
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTransaction = async (id: TransactionId, transaction: UpdateTransactionParams) => {
  const { session } = await getUserAuth();
  const { id: transactionId } = transactionIdSchema.parse({ id });
  const newTransaction = updateTransactionSchema.parse({ ...transaction, userId: session?.user.id! });
  try {
    const t = await db.transaction.update({ where: { id: transactionId, userId: session?.user.id! }, data: newTransaction})
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTransaction = async (id: TransactionId) => {
  const { session } = await getUserAuth();
  const { id: transactionId } = transactionIdSchema.parse({ id });
  try {
    const t = await db.transaction.delete({ where: { id: transactionId, userId: session?.user.id! }})
    return { transaction: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

