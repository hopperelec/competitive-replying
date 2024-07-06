<script>
import { signIn } from "@auth/sveltekit/client";
</script>

<button on:click={() => signIn("discord")}>Login with Discord</button>

<style>
button {
    background-color: #5662f6;
    color: white;
    font-size: 1.3em;
    padding: .5em;
    border-radius: .5em;
    border: 2px solid #000;
    cursor: pointer;
}
</style>