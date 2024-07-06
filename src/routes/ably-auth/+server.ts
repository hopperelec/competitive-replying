import ablyServer from "$lib/server/ably-server";
import { json } from "@sveltejs/kit";

// Authenticates a user with Ably by returning a "token request" which the
// client can use to request an Ably token via the Ably API
export const GET = async () => {
	return json(
		await ablyServer.auth.createTokenRequest({
			capability: {
				game: ["subscribe"],
			},
		}),
	);
};
