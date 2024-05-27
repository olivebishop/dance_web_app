import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getAgentById } from "@/lib/api/agents/queries";
import OptimisticAgent from "./OptimisticAgent";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function AgentPage({
  params,
}: {
  params: { agentId: string };
}) {

  return (
    <main className="overflow-auto">
      <Agent id={params.agentId} />
    </main>
  );
}

const Agent = async ({ id }: { id: string }) => {
  await checkAuth();

  const { agent } = await getAgentById(id);
  

  if (!agent) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="agents" />
        <OptimisticAgent agent={agent}  />
      </div>
    </Suspense>
  );
};
