import {SvelteKitAuth} from "@auth/sveltekit";
import Discord from "@auth/sveltekit/providers/discord";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "$lib/server/prisma";

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Discord],
});
