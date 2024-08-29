import prisma from "$lib/server/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Discord from "@auth/sveltekit/providers/discord";

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Discord],
	callbacks: {
		session: ({ session, user }) => {
			return {
				user: { id: user.id, name: user.name },
				expires: session.expires,
			};
		},
	},
});
