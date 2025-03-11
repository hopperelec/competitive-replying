<script lang="ts">
import DefaultPFP from "$lib/media/default_pfp.svg";

let { user }: {
  user: { name: string | null; image: string | null };
} = $props();
let displayName = $derived(user.name ?? "User");
</script>

<div>
  <img src={user.image || DefaultPFP} alt={`${displayName}'s profile picture`}/>
  <span>{displayName}</span>
</div>

<style>
div {
  display: inline-flex;
  align-items: center;
}

img {
  border-radius: 50%;
  width: 1em;
  height: 1em;
  margin-right: .5ch;
}
</style>