import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/transactions/useOptimisticTransactions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type Transaction, insertTransactionParams } from "@/lib/db/schema/transactions";
import {
  createTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
} from "@/lib/actions/transactions";


const TransactionForm = ({
  
  transaction,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  transaction?: Transaction | null;
  
  openModal?: (transaction?: Transaction) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Transaction>(insertTransactionParams);
  const editing = !!transaction?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("transactions");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Transaction },
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
      toast.success(`Transaction ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const transactionParsed = await insertTransactionParams.safeParseAsync({  ...payload });
    if (!transactionParsed.success) {
      setErrors(transactionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = transactionParsed.data;
    const pendingTransaction: Transaction = {
      updatedAt: transaction?.updatedAt ?? new Date(),
      createdAt: transaction?.createdAt ?? new Date(),
      id: transaction?.id ?? "",
      userId: transaction?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingTransaction,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateTransactionAction({ ...values, id: transaction.id })
          : await createTransactionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingTransaction 
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
          defaultValue={transaction?.id ?? ""}
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
            errors?.agentId ? "text-destructive" : "",
          )}
        >
          Agent Id
        </Label>
        <Input
          type="text"
          name="agentId"
          className={cn(errors?.agentId ? "ring ring-destructive" : "")}
          defaultValue={transaction?.agentId ?? ""}
        />
        {errors?.agentId ? (
          <p className="text-xs text-destructive mt-2">{errors.agentId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.amountWithdrawal ? "text-destructive" : "",
          )}
        >
          Amount Withdrawal
        </Label>
        <Input
          type="text"
          name="amountWithdrawal"
          className={cn(errors?.amountWithdrawal ? "ring ring-destructive" : "")}
          defaultValue={transaction?.amountWithdrawal ?? ""}
        />
        {errors?.amountWithdrawal ? (
          <p className="text-xs text-destructive mt-2">{errors.amountWithdrawal[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.amountDeposited ? "text-destructive" : "",
          )}
        >
          Amount Deposited
        </Label>
        <Input
          type="text"
          name="amountDeposited"
          className={cn(errors?.amountDeposited ? "ring ring-destructive" : "")}
          defaultValue={transaction?.amountDeposited ?? ""}
        />
        {errors?.amountDeposited ? (
          <p className="text-xs text-destructive mt-2">{errors.amountDeposited[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: transaction });
              const error = await deleteTransactionAction(transaction.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: transaction,
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

export default TransactionForm;

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
