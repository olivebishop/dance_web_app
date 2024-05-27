import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/agents/useOptimisticAgents";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { type Agent, insertAgentParams } from "@/lib/db/schema/agents";
import {
  createAgentAction,
  deleteAgentAction,
  updateAgentAction,
} from "@/lib/actions/agents";


const AgentForm = ({
  
  agent,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  agent?: Agent | null;
  
  openModal?: (agent?: Agent) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Agent>(insertAgentParams);
  const editing = !!agent?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("agents");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Agent },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Agent ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const agentParsed = await insertAgentParams.safeParseAsync({  ...payload });
    if (!agentParsed.success) {
      setErrors(agentParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = agentParsed.data;
    const pendingAgent: Agent = {
      updatedAt: agent?.updatedAt ?? new Date(),
      createdAt: agent?.createdAt ?? new Date(),
      id: agent?.id ?? "",
      userId: agent?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingAgent,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateAgentAction({ ...values, id: agent.id })
          : await createAgentAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingAgent 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.id ? "text-destructive" : "",
          )}
        >
          Id
        </Label>
        <Input
          type="text"
          name="id"
          className={cn(errors?.id ? "ring ring-destructive" : "")}
          defaultValue={agent?.id ?? ""}
        />
        {errors?.id ? (
          <p className="text-xs text-destructive mt-2">{errors.id[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={agent?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.idNumber ? "text-destructive" : "",
          )}
        >
          Id Number
        </Label>
        <Input
          type="text"
          name="idNumber"
          className={cn(errors?.idNumber ? "ring ring-destructive" : "")}
          defaultValue={agent?.idNumber ?? ""}
        />
        {errors?.idNumber ? (
          <p className="text-xs text-destructive mt-2">{errors.idNumber[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.phoneNumber ? "text-destructive" : "",
          )}
        >
          Phone Number
        </Label>
        <Input
          type="text"
          name="phoneNumber"
          className={cn(errors?.phoneNumber ? "ring ring-destructive" : "")}
          defaultValue={agent?.phoneNumber ?? ""}
        />
        {errors?.phoneNumber ? (
          <p className="text-xs text-destructive mt-2">{errors.phoneNumber[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: agent });
              const error = await deleteAgentAction(agent.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: agent,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default AgentForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
