import fp from "fastify-plugin";

declare module "fastify" {
    interface FastifyRequest {
        cantaraUserParty?: string;
    }
}

export default fp(async function userIdentityPlugin(fastify) {
    fastify.addHook("preHandler", async (request, reply) => {
        const userParty = request.headers["x-cantara-user"];
        console.log("Auth Middleware - Received x-cantara-user:", userParty);
        if (typeof userParty === "string" && userParty.trim().length > 0) {
            request.cantaraUserParty = userParty;
        }
        // TODO: Replace x-cantara-user header with a proper JWT or wallet-based auth system.
        // Do NOT trust any wallet address or party id as “real identity” yet; this is a dev/devnet assumption.
    });
});
