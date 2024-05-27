"use server";

import { revalidatePath } from "next/cache";
import {
  createAgent,
  deleteAgent,
  updateAgent,
} from "@/lib/api/agents/mutations";
import {
  AgentId,
  NewAgentParams,
  UpdateAgentParams,
  agentIdSchema,
  insertAgentParams,
  updateAgentParams,
} from "@/lib/db/schema/agents";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAgents = () => revalidatePath("/agents");

export const createAgentAction = async (input: NewAgentParams) => {
  try {
    const payload = insertAgentParams.parse(input);
    await createAgent(payload);
    revalidateAgents();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAgentAction = async (input: UpdateAgentParams) => {
  try {
    const payload = updateAgentParams.parse(input);
    await updateAgent(payload.id, payload);
    revalidateAgents();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAgentAction = async (input: AgentId) => {
  try {
    const payload = agentIdSchema.parse({ id: input });
    await deleteAgent(payload.id);
    revalidateAgents();
  } catch (e) {
    return handleErrors(e);
  }
};