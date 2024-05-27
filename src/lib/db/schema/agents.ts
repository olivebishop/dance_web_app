import { agentSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getAgents } from "@/lib/api/agents/queries";


// Schema for agents - used to validate API requests
const baseSchema = agentSchema.omit(timestamps)

export const insertAgentSchema = baseSchema.omit({ id: true });
export const insertAgentParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateAgentSchema = baseSchema;
export const updateAgentParams = updateAgentSchema.extend({}).omit({ 
  userId: true
});
export const agentIdSchema = baseSchema.pick({ id: true });

// Types for agents - used to type API request params and within Components
export type Agent = z.infer<typeof agentSchema>;
export type NewAgent = z.infer<typeof insertAgentSchema>;
export type NewAgentParams = z.infer<typeof insertAgentParams>;
export type UpdateAgentParams = z.infer<typeof updateAgentParams>;
export type AgentId = z.infer<typeof agentIdSchema>["id"];
    
// this type infers the return from getAgents() - meaning it will include any joins
export type CompleteAgent = Awaited<ReturnType<typeof getAgents>>["agents"][number];

