<script setup lang="ts">
import { VxButton, VxCallout, VxEmptyState, VxProgress, VxSkeleton, VxSpinner } from '../../src'
import StoryFrame from '../StoryFrame.vue'
</script>

<template>
  <Story title="Feedback" group="feedback">
    <Variant title="Callouts">
      <StoryFrame site="dtp">
        <div class="story-col" style="max-width: 640px">
          <VxCallout tone="info" title="Heads up">The bot rejoins automatically after a restart.</VxCallout>
          <VxCallout tone="ok">Saved. Changes apply on the next message.</VxCallout>
          <VxCallout tone="warn" title="Bot is not a moderator">Timeouts and deletions won't work until it is.</VxCallout>
          <VxCallout tone="error" title="Banned from #somechannel">
            The bot was banned 2 hours ago.
            <template #actions><VxButton size="sm">Rejoin</VxButton></template>
          </VxCallout>
          <VxCallout tone="error" title="Parse error at 1:24">
            <pre class="vx-code" style="margin-top: 6px">!so {user} &gt; "check out {user.display_name} at twitch.tv/{user.login} — they were last playing {user.game}"</pre>
          </VxCallout>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Progress & loading">
      <StoryFrame>
        <div class="story-col">
          <VxProgress :value="62" label="Watched" />
          <div class="story-row"><VxSpinner /> Loading chat…</div>
          <div class="story-row" style="align-items: flex-start">
            <VxSkeleton w="220px" ratio="16 / 9" />
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px">
              <VxSkeleton w="80%" />
              <VxSkeleton w="40%" h="0.8em" />
            </div>
          </div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Empty state / 404">
      <StoryFrame>
        <VxEmptyState code="404" title="This page drifted off." text="The link may be old, or the VOD was removed.">
          <template #actions>
            <VxButton variant="primary" href="#">Go home</VxButton>
            <VxButton href="#">Browse VODs</VxButton>
          </template>
        </VxEmptyState>
      </StoryFrame>
    </Variant>
  </Story>
</template>
