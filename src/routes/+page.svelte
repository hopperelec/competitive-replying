<script lang="ts">
import { getChannel } from "$lib/ably-client";
import canSeeRepliesFor from "$lib/can-see-replies-for";
import LoginPrompt from "$lib/components/LoginPrompt.svelte";
import Submission from "$lib/components/Submission.svelte";
import SubmitPrompt from "$lib/components/SubmitPrompt.svelte";
import SubmitReply from "$lib/components/SubmitReply.svelte";
import type ably from "ably";
import type {Unsubscriber} from "svelte/store";

let { data } = $props();

let i = $state(data.prompts.length);
let currentlyViewedPrompt = $derived(data.prompts[i - 1]);
let repliesUnsubscribe: Unsubscriber | undefined;
async function setCurrentlyViewedPrompt(newI: number) {
  repliesUnsubscribe?.();
  i = newI;
  if (!canSeeRepliesFor(data.session, currentlyViewedPrompt)) return;

  // Update replies
  const res = await fetch(`/prompts/${currentlyViewedPrompt.id}/replies`);
  const json = await res.json();
  if (res.ok) {
    currentlyViewedPrompt.replies = json;
    repliesUnsubscribe = getChannel(`prompts:${currentlyViewedPrompt.id}:replies`)
              ?.subscribe(repliesMessage => {
                if (repliesMessage?.name === "new-reply") {
                  currentlyViewedPrompt.replies =
                          [...(currentlyViewedPrompt.replies || []), repliesMessage.data]
                }
              });
  } else alert(json.message);
}

getChannel("prompts")?.subscribe(
        (promptsMessage: ably.InboundMessage) => {
          if (promptsMessage && promptsMessage.name === "new-prompt") {
            data.prompts.push({
              ...promptsMessage.data,
              locked: false,
            });
          }
        }
);
</script>

<div id="page-container">
  {#if data.session?.user}
    <SubmitPrompt/>
  {:else}
    <LoginPrompt prompt="submit prompts"/>
  {/if}

  {#if data.prompts.length === 0}
    <p>No prompts have been submitted yet.</p>
  {:else}
    <div id="buttons">
      <button onclick={() => setCurrentlyViewedPrompt(i-1)} disabled={i === 1}>Last Prompt</button>
      <p>{i} / {data.prompts.length}</p>
      <button onclick={() => setCurrentlyViewedPrompt(i+1)} disabled={i === data.prompts.length}>Next Prompt</button>
    </div>
    <div id="prompt">
      <Submission content={currentlyViewedPrompt.content} user={currentlyViewedPrompt.prompter} session={data.session}/>
    </div>
    {#if currentlyViewedPrompt.locked}
      <p id="locked">&#9888 This prompt is locked</p>
    {/if}
    {#if currentlyViewedPrompt.replies !== undefined}
      {#if currentlyViewedPrompt.replies.length === 0}
        {#if currentlyViewedPrompt.locked}
          <p>No replies were submitted for this prompt</p>
        {:else}
          <p>No replies have been submitted for this prompt yet.</p>
        {/if}
      {:else}
        <ul id="replies">
          {#each currentlyViewedPrompt.replies as reply}
            <li>
              <Submission content={reply.content} user={reply.replier} session={data.session}/>
            </li>
          {/each}
        </ul>
      {/if}
    {:else if data.session?.user}
      <SubmitReply promptId={currentlyViewedPrompt.id}/>
    {:else}
      <LoginPrompt prompt="submit replies"/>
    {/if}
  {/if}
</div>

<style>
#page-container, #prompt, #replies > li {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#buttons {
  display: flex;
  align-items: center;
  margin: .5em;

  & > p {
    margin: 0 .5em;
  }
}

#prompt, #locked {
  font-weight: bold;
}

#locked {
  color: gold;
}

#replies {
  list-style-type: none;
  padding: 0;
  margin: 0;

  & > li {
    margin: 1em;
  }
}
</style>