<script lang="ts">
import LoginButton from "$lib/components/LoginButton.svelte";
import type {PageData} from "./$types";

export let data: PageData;
</script>

{#if data.session == null}
    <LoginButton/>
{:else}
  <p>Welcome, {data.session.user?.name ?? "User"}!</p>
{/if}