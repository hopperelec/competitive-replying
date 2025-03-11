<script lang="ts">
let { promptId }: { promptId: number } = $props();

let reply: string = $state("");
let locked = $state(false);

async function onKeyUp(event: KeyboardEvent) {
	if (event.key === "Enter") {
		locked = true;
		const res = await fetch(`/prompts/${promptId}/replies`, {
			method: "POST",
			body: reply,
		});
		if (!res.ok) {
			locked = false;
			alert((await res.json()).message);
		}
	}
}
</script>

<input type="text" placeholder="Submit a reply" onkeyup={onKeyUp} bind:value={reply} disabled={locked} />
