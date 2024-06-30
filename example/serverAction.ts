"use server";
import { ActionResponse } from "../";

async function getProfile(username: string) {
  const user = await getUserFromDb(username);
  if (!user) {
    return ActionResponse.notFound();
  }
  return ActionResponse.ok(user);
}
