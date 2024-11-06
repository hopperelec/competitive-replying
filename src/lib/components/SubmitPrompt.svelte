<script lang="ts">
let prompt: string;

async function onKeyUp(event: KeyboardEvent) {
	if (event.key === "Enter") {
		const res = await fetch("/prompts", {
			method: "POST",
			body: prompt,
		});
		if (res.ok) prompt = "";
		else alert((await res.json()).message);
	}
}
</script>

<input type="text" placeholder="Submit a prompt" on:keyup={onKeyUp} bind:value={prompt} />

<style>
input {
  margin: .5em;
}
</style>