export type Prompt = {
	id: number;
	content: string;
	prompter: { name: string | null; image: string | null };
	locked: boolean;
	replies?: {
		content: string;
		replier: { name: string | null; image: string | null };
	}[];
};
