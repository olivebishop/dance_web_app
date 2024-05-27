
import { type Agent, type CompleteAgent } from "@/lib/db/schema/agents";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Agent>) => void;

export const useOptimisticAgents = (
  agents: CompleteAgent[],
  
) => {
  const [optimisticAgents, addOptimisticAgent] = useOptimistic(
    agents,
    (
      currentState: CompleteAgent[],
      action: OptimisticAction<Agent>,
    ): CompleteAgent[] => {
      const { data } = action;

      

      const optimisticAgent = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticAgent]
            : [...currentState, optimisticAgent];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticAgent } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticAgent, optimisticAgents };
};
