import * as z from "zod"

export const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  idNumber: z.string(),
  phoneNumber: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
