import * as z from "zod"

export const transactionSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  amountWithdrawal: z.number().int(),
  amountDeposited: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
