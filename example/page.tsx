"use client";
import { action } from "../";
import { getProfile } from "./serverAction";

export default function Page() {
  async function get() {
    try {
      const response = await action(getProfile());
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <button onClick={get} />
    </div>
  );
}
