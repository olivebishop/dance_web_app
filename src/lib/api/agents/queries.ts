import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type AgentId, agentIdSchema } from "@/lib/db/schema/agents";

export const getAgents = async () => {
  const { session } = await getUserAuth();
  const a = await db.agent.findMany({ where: {userId: session?.user.id!}});
  return { agents: a };
};

export const getAgentById = async (id: AgentId) => {
  const { session } = await getUserAuth();
  const { id: agentId } = agentIdSchema.parse({ id });
  const a = await db.agent.findFirst({
    where: { id: agentId, userId: session?.user.id!}});
  return { agent: a };
};


