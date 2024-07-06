import { handle as authHandle } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import type { Options } from "html-minifier-terser";
import { minify } from "html-minifier-terser";

const minification_options: Options = {
	collapseInlineTagWhitespace: true,
	collapseWhitespace: true,
	minifyJS: true,
	minifyCSS: true,
	noNewlinesBeforeTagClose: true,
	removeRedundantAttributes: true,
};

export const handle: Handle = async ({ event, resolve }) => {
	let page = "";

	return authHandle({
		event,
		resolve: (event) =>
			resolve(event, {
				transformPageChunk: ({ html, done }) => {
					page += html;
					if (done) {
						return minify(page, minification_options);
					}
				},
			}),
	});
};
