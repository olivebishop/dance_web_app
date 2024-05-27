import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createAgent,
  deleteAgent,
  updateAgent,
} from "@/lib/api/agents/mutations";
import { 
  agentIdSchema,
  insertAgentParams,
  updateAgentParams 
} from "@/lib/db/schema/agents";

export async function POST(req: Request) {
  try {
    const validatedData = insertAgentParams.parse(await req.json());
    const { success } = await createAgent(validatedData);

    revalidatePath("/agents"); // optional - assumes you will have named route same as entity

    return NextResponse.json(success, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateAgentParams.parse(await req.json());
    const validatedParams = agentIdSchema.parse({ id });

    const { success } = await updateAgent(validatedParams.id, validatedData);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = agentIdSchema.parse({ id });
    const { success } = await deleteAgent(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
