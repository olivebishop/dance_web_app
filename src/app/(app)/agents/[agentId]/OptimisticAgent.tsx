"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/agents/useOptimisticAgents";
import { type Agent } from "@/lib/db/schema/agents";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import AgentForm from "@/components/agents/AgentForm";


export default function OptimisticAgent({ 
  agent,
   
}: { 
  agent: Agent; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Agent) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticAgent, setOptimisticAgent] = useOptimistic(agent);
  const updateAgent: TAddOptimistic = (input) =>
    setOptimisticAgent({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <AgentForm
          agent={optimisticAgent}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateAgent}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticAgent.id}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticAgent.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticAgent, null, 2)}
      </pre>
    </div>
  );
}
