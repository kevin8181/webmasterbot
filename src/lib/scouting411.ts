import { z } from "zod";

// client for the Scouting411 API: https://scouting411.org/api

export const SCOUTING411_URL = "https://scouting411.org";

const searchItemSchema = z.object({
	id: z.string(),
	type: z.enum([
		"page",
		"hub",
		"feed",
		"resource",
		"rank",
		"meritBadge",
		"adventure",
		"award",
	]),
	name: z.string(),
	description: z.string().optional(),
	/** a site path, or an absolute URL when `external` is true */
	url: z.string(),
	external: z.boolean(),
	image: z.url().optional(),
	color: z.templateLiteral(["#", z.string()]).optional(),
});

export type SearchItem = z.infer<typeof searchItemSchema>;

async function get(path: string) {
	const response = await fetch(`${SCOUTING411_URL}/api${path}`);
	if (!response.ok) {
		throw new Error(
			`Scouting411 ${path} returned ${response.status} ${response.statusText}`,
		);
	}
	return response.json();
}

/** fuzzy search by name, best match first */
export async function search(query: string, limit: number) {
	const params = new URLSearchParams({ q: query, limit: String(limit) });
	return z.array(searchItemSchema).parse(await get(`/search?${params}`));
}

/** every searchable item */
export async function listItems() {
	return z.array(searchItemSchema).parse(await get("/search/items"));
}
