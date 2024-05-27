"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Agent, CompleteAgent } from "@/lib/db/schema/agents";
import Modal from "@/components/shared/Modal";

import { useOptimisticAgents } from "@/app/(app)/agents/useOptimisticAgents";
import { Button } from "@/components/ui/button";
import AgentForm from "./AgentForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (agent?: Agent) => void;

export default function AgentList({
  agents,
   
}: {
  agents: CompleteAgent[];
   
}) {
  const { optimisticAgents, addOptimisticAgent } = useOptimisticAgents(
    agents,
     
  );
  const [open, setOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const openModal = (agent?: Agent) => {
    setOpen(true);
    agent ? setActiveAgent(agent) : setActiveAgent(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeAgent ? "Edit Agent" : "Create Agent"}
      >
        <AgentForm
          agent={activeAgent}
          addOptimistic={addOptimisticAgent}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticAgents.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticAgents.map((agent) => (
            <Agent
              agent={agent}
              key={agent.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Agent = ({
  agent,
  openModal,
}: {
  agent: CompleteAgent;
  openModal: TOpenModal;
}) => {
  const optimistic = agent.id === "optimistic";
  const deleting = agent.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("agents")
    ? pathname
    : pathname + "/agents/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{agent.id}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + agent.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No agents
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new agent.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Agents </Button>
      </div>
    </div>
  );
};
