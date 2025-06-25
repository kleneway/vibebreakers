import { inngest } from "../../inngest.config";

export const userRegistered = inngest.createFunction(
  { name: "User Registered", id: "user/registered" },
  { event: "user/registered" },
  async ({ event, step }) => {
    // Handle the event
  },
);
