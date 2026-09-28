import { ProactiveSetting, ChatMessage } from '../types/chat';
import { ContextSnapshot } from '../types/context';
import { MemoryItem } from '../types/memory';

export class ProactiveService {
  /**
   * Determines if proactive contact is allowed right now based on settings and time
   */
  public static canSendProactivePing(settings: ProactiveSetting): { allowed: boolean; reason?: string } {
    if (settings.isPaused) {
      return { allowed: false, reason: 'Proactivity is temporarily paused by user' };
    }

    if (settings.mode === 'QUIET') {
      return { allowed: false, reason: 'Mode is set to Quiet (reactive only)' };
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    // Quiet hours check
    if (settings.quietHoursStart > settings.quietHoursEnd) {
      // Overnight (e.g., 22:00 to 08:00)
      if (currentFormatted >= settings.quietHoursStart || currentFormatted < settings.quietHoursEnd) {
        return { allowed: false, reason: 'Within scheduled Quiet Hours (no notifications)' };
      }
    } else {
      if (currentFormatted >= settings.quietHoursStart && currentFormatted < settings.quietHoursEnd) {
        return { allowed: false, reason: 'Within scheduled Quiet Hours (no notifications)' };
      }
    }

    return { allowed: true };
  }

  /**
   * Evaluates if a proactive trigger is appropriate for current user context
   */
  public static evaluateCandidateProactiveMessage(
    context: ContextSnapshot,
    memories: MemoryItem[],
    settings: ProactiveSetting
  ): ChatMessage | null {
    const check = this.canSendProactivePing(settings);
    if (!check.allowed) return null;

    // Follow-up trigger: Important meeting review in past 3 hours
    const reviewMem = memories.find(m => m.key === 'design_review_marcus');
    if (reviewMem && settings.allowMeetingFollowUps) {
      return {
        id: `proact_${Date.now()}`,
        sender: 'ASSISTANT',
        text: 'Hey Alex. I noticed your Q3 design review with Marcus wrapped up a bit ago. You mentioned feeling some pressure leading up to it. How did it end up going?',
        timestamp: new Date().toISOString(),
        isProactive: true,
        proactiveReason: 'Follow-up on your flagged 2:00 PM design review with Marcus',
        sourceMemoryTrigger: reviewMem.id,
        suggestedReplies: [
          'It went really well! He approved the core direction.',
          'Pretty exhausting. Lots of pushback on mobile navigation.',
          'I don’t want to think about work right now, let’s reset.',
        ],
      };
    }

    return null;
  }
}
