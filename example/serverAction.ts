"use server";
import { ActionResponse } from "../";

export async function getProfile() {
  const user = { name: "Mike", birth: "20030506" };
  if (!user) {
    return ActionResponse.notFound();
  }
  return ActionResponse.ok(user);
}

export async function getProfile(username) {
  const user = { name: "Mike", birth: "20030506" };
  if (!user) {
    return ActionResponse.notFound();
  }
  return ActionResponse.ok(user);
}
