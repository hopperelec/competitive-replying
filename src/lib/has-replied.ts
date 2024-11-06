import type { Prompt } from "$lib/types";

export default function (
	session: undefined | null | { user?: { name?: string | null } },
	prompt: { replies?: Prompt["replies"] },
) {
	return prompt.replies?.some(
		(reply) => reply.replier.name === session?.user?.name,
	);
}
