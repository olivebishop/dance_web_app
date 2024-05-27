import { db } from "@/lib/db/index";
import { 
  AgentId, 
  NewAgentParams,
  UpdateAgentParams, 
  updateAgentSchema,
  insertAgentSchema, 
  agentIdSchema 
} from "@/lib/db/schema/agents";
import { getUserAuth } from "@/lib/auth/utils";

export const createAgent = async (agent: NewAgentParams) => {
  const { session } = await getUserAuth();
  const newAgent = insertAgentSchema.parse({ ...agent, userId: session?.user.id! });
  try {
    const a = await db.agent.create({ data: newAgent });
    return { agent: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAgent = async (id: AgentId, agent: UpdateAgentParams) => {
  const { session } = await getUserAuth();
  const { id: agentId } = agentIdSchema.parse({ id });
  const newAgent = updateAgentSchema.parse({ ...agent, userId: session?.user.id! });
  try {
    const a = await db.agent.update({ where: { id: agentId, userId: session?.user.id! }, data: newAgent})
    return { agent: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAgent = async (id: AgentId) => {
  const { session } = await getUserAuth();
  const { id: agentId } = agentIdSchema.parse({ id });
  try {
    const a = await db.agent.delete({ where: { id: agentId, userId: session?.user.id! }})
    return { agent: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

