import { Suspense } from "react";

import Loading from "@/app/loading";
import AgentList from "@/components/agents/AgentList";
import { getAgents } from "@/lib/api/agents/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function AgentsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Agents</h1>
        </div>
        <Agents />
      </div>
    </main>
  );
}

const Agents = async () => {
  await checkAuth();

  const { agents } = await getAgents();
  
  return (
    <Suspense fallback={<Loading />}>
      <AgentList agents={agents}  />
    </Suspense>
  );
};
