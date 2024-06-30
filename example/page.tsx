"use client";
import { action } from "../";

export default function Page() {
  async function get() {
    try {
      const response = await action(getProfile('mike'));
      console.log(response)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div>
      <button onClick={get} />
    </div>
  );
}
