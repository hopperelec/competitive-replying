import hasReplied from "$lib/has-replied";
import type { Prompt } from "$lib/types";

export default function (
	session: undefined | null | { user?: { name?: string | null } },
	prompt: {
		locked: boolean;
		prompter: { name: string | null };
		replies?: Prompt["replies"];
	},
) {
	return (
		prompt.locked ||
		prompt.prompter.name === session?.user?.name ||
		hasReplied(session, prompt)
	);
}
