<script lang="ts">
import {getChannel} from "$lib/ably-client";
import LoginPrompt from "$lib/components/LoginPrompt.svelte";
import SubmitPrompt from "$lib/components/SubmitPrompt.svelte";
import UserLabel from "$lib/components/UserLabel.svelte";
import type { PageData } from "./$types";

export let data: PageData;

const promptsMessage = getChannel("prompts");
$: if ($promptsMessage && $promptsMessage.name === "new-prompt") {
    data.prompts = [
        ...data.prompts,
        {
            ...$promptsMessage.data,
            locked: false,
        }
    ];
}

let i = data.prompts.length;
$: currentlyViewedPrompt = data.prompts[i-1];
</script>

<div id="page-container">
  {#if data.session == null}
    <LoginPrompt prompt="submit prompts"/>
  {:else}
    <SubmitPrompt/>
  {/if}

  {#if data.prompts.length === 0}
    <p>No prompts have been submitted yet.</p>
  {:else}
    <div id="buttons">
      <button on:click={() => i--} disabled={i === 1}>Last Prompt</button>
      <p>{i} / {data.prompts.length}</p>
      <button on:click={() => i++} disabled={i === data.prompts.length}>Next Prompt</button>
    </div>
    <div id="prompt">
      <p id="prompt-content">{currentlyViewedPrompt.content}</p>
      <p id="submitted-by"><span>Submitted by</span><UserLabel user={currentlyViewedPrompt.prompter}/></p>
    </div>
    {#if currentlyViewedPrompt.locked}<p id="locked">&#9888 This prompt is locked<p>{/if}
  {/if}
</div>

<style>
#page-container, #prompt {
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

#prompt {
  margin-bottom: 1em;
}

#prompt-content, #locked {
  font-weight: bold;
}

#locked {
  color: gold;
}

#submitted-by {
  display: flex;
  align-items: center;
    
  & > span {
    font-style: italic;
    margin-right: 1ch;
  }
}
</style>