// convex/auth.config.ts
const authConfig = {
  providers: [
    {
      domain: "https://proud-tadpole-1156.clerk.accounts.dev",
      applicationID: "convex", // ← must be "convex", not a dynamic env var
    },
  ],
};

export default authConfig;
