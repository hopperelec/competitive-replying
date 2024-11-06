<script lang="ts">
import UserLabel from "$lib/components/UserLabel.svelte";
import type { Session } from "@auth/sveltekit";

export let content: string;
export let user: { name: string | null; image: string | null };
export let session: null | Session;
</script>

<p id="content">{content}</p>
<p id="submitted-by">
    {#if user.name === session?.user?.name}
      <span>Submitted by you!</span>
    {:else}
      <span class="right-margin">Submitted by</span>
      <UserLabel {user}/>
    {/if}
</p>

<style>
#submitted-by {
    display: flex;
    align-items: center;

    & span{
        font-style: italic;
    }
}

.right-margin {
    margin-right: 1ch;
}
</style>