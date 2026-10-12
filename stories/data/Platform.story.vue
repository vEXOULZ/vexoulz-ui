<script setup lang="ts">
// @vexoulz/platform-web's components with @vexoulz/ui/platform.css loaded: they should read as Deep Field (black,
// Geist, the StoryFrame site's accent: dtp gold, vods green), not platform-web's neutral defaults.
import { EmoteSet, toChatLine, type LogMessage, type LogModeration } from '@vexoulz/platform-web/chat'
import { ChatLine, JobsTable, StateChip } from '@vexoulz/platform-web/vue'
import { JOB_STATES, type JobOut } from '@vexoulz/platform-web'
// The mapping first on purpose: plain :root still outranks platform-web's :where(:root) defaults loaded after it.
import '../../src/styles/platform.css'
import '@vexoulz/platform-web/style.css'
import StoryFrame from '../StoryFrame.vue'

const job = (id: number, state: JobOut['state'], kind: string, extra: Partial<JobOut> = {}): JobOut => ({
  id, kind, subject: `vod:${2400 + id}`, scope: 'vexoulz', state, step: 'transcode', steps: ['fetch', 'transcode', 'publish'],
  payload: {}, attempts: 1, last_error: null, not_before: null, pause_before: null, pause_next: false,
  cancel_requested: false, actor: { kind: 'system', id: null, login: null } as JobOut['actor'],
  created_at: '2026-10-12T14:00:00Z', updated_at: '2026-10-12T14:05:00Z', started_at: '2026-10-12T14:00:10Z',
  finished_at: null, ...extra,
})
const jobs = [
  job(812, 'running', 'vod.import'),
  job(811, 'failed', 'vod.import', { last_error: 'part 3: 502 from the archive', finished_at: '2026-10-12T13:58:00Z' }),
  job(810, 'succeeded', 'chat.backfill', { step: null, finished_at: '2026-10-12T13:40:00Z' }),
]

const emotes = new EmoteSet()
const user = { id: '1', login: 'someone', display_name: 'SomeOne' }
const base = {
  kind: 'message', at: '2026-10-12T18:00:00Z', user, badges: [], color: '#1E90FF', bits: 0, message_type: 'text',
  reply_parent_id: null, reply_parent_user: null, reward_id: null, source_channel_id: null, is_self: false,
  is_command: false, source: 'eventsub', received_at: null, deleted_at: null, cleared_at: null, run: null,
} as const
const msg = (id: string, text: string, extra: Partial<LogMessage> = {}): LogMessage =>
  ({ ...base, id, text, fragments: [{ text }], ...extra }) as LogMessage
const timeout: LogModeration = {
  kind: 'moderation', id: 1, at: '2026-10-12T18:02:00Z', type: 'timeout', message_id: null,
  target: { id: '2', login: 'spammer' }, moderator: { id: '3', login: 'mod', display_name: 'Mod' },
  duration_s: 600, reason: 'spam', source: 'eventsub',
}
const lines = [
  msg('a', 'hello Kappa', { fragments: [{ text: 'hello ' }, { text: 'Kappa', emote: { id: '25' } }] }),
  msg('b', 'waves', { message_type: 'action', user: { id: '4', login: 'dimname', display_name: 'dimname' }, color: '#000080' }),
  msg('c', 'this was removed', { deleted_at: '2026-10-12T18:01:00Z' }),
  timeout,
].map((raw) => toChatLine(raw, emotes))
</script>

<template>
  <Story title="Platform (platform.css)" group="data" :layout="{ type: 'single', iframe: true }">
    <Variant title="Controls & states">
      <StoryFrame site="dtp">
        <div class="vxp story-col">
          <p class="vxp-eyebrow">Controls</p>
          <div class="story-row">
            <button class="vxp-btn primary">Retry</button>
            <button class="vxp-btn">Pause</button>
            <button class="vxp-btn danger">Cancel</button>
            <button class="vxp-btn sm">Small</button>
            <input class="vxp-input" placeholder="subject (vod:…)" />
          </div>
          <p class="vxp-eyebrow">States</p>
          <div class="story-row"><StateChip v-for="s in JOB_STATES" :key="s" :state="s" /></div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Jobs table">
      <StoryFrame site="dtp"><div class="vxp"><JobsTable :jobs="jobs" /></div></StoryFrame>
    </Variant>
    <Variant title="Chat lines">
      <StoryFrame site="vods">
        <div class="vxp vxp-panel story-chat">
          <ChatLine v-for="l in lines" :key="l.id" :line="l">
            <template #before><span class="vxp-mono vxp-muted" style="margin-right: 0.5ch">18:00</span></template>
          </ChatLine>
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>

<style scoped>
.story-chat { padding: 10px 12px; background: var(--vxp-chat-bg); color: var(--vxp-chat-ink); }
</style>
