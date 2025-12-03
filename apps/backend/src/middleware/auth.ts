import fp from "fastify-plugin";

declare module "fastify" {
    interface FastifyRequest {
        cantaraUserParty?: string;
        cantaraInstitutionParty?: string;
        cantaraRole?: "user" | "institution" | "admin";
        cantaraPrivacyMode?: "Public" | "Private";
    }
}

export default fp(async function userIdentityPlugin(fastify) {
    fastify.addHook("preHandler", async (request, reply) => {
        const userParty = request.headers["x-cantara-user"];
        const institutionParty = request.headers["x-cantara-institution"];
        const role = request.headers["x-cantara-role"];

        console.log("Auth Middleware - Received x-cantara-user:", userParty);
        console.log("Auth Middleware - Received x-cantara-institution:", institutionParty);
        console.log("Auth Middleware - Received x-cantara-role:", role);

        if (typeof userParty === "string" && userParty.trim().length > 0) {
            request.cantaraUserParty = userParty.trim();
        }

        if (typeof institutionParty === "string" && institutionParty.trim().length > 0) {
            request.cantaraInstitutionParty = institutionParty.trim();
        }

        if (typeof role === "string" && ["user", "institution", "admin"].includes(role)) {
            request.cantaraRole = role as "user" | "institution" | "admin";
        } else {
            request.cantaraRole = "user"; // Default to user
        }

        const privacyModeHeader = request.headers["x-cantara-privacy-mode"];
        if (typeof privacyModeHeader === "string" && ["Public", "Private"].includes(privacyModeHeader)) {
            request.cantaraPrivacyMode = privacyModeHeader as "Public" | "Private";
        } else {
            request.cantaraPrivacyMode = "Public"; // Default to Public
        }

        // TODO: Replace x-cantara-user header with a proper JWT or wallet-based auth system.
        // Do NOT trust any wallet address or party id as “real identity” yet; this is a dev/devnet assumption.
    });
});
