<script lang="ts">
import { signIn } from "@auth/sveltekit/client";
export let prompt: string;
</script>

<p>
  <button on:click={() => signIn("discord")}>Login with Discord</button>
  <span>to {prompt}</span>
</p>

<style>
p {
  margin: .5em;
}

button {
  background-color: #5662f6;
  color: white;
  padding: .25em;
  border-radius: .5em;
  border: 2px solid #000;
  cursor: pointer;
}
</style>