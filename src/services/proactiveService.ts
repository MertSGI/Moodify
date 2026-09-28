import { ProactiveSetting, ChatMessage } from '../types/chat';
import { ContextSnapshot } from '../types/context';
import { MemoryItem } from '../types/memory';

export class ProactiveService {
  /**
   * Tracks simulated proactive pings sent today to enforce non-manipulative frequency caps.
   * Starts at 0, date-aware.
   */
  private static pingsSentTodayCount: number = 0;
  private static lastPingDate: string = new Date().toISOString().split('T')[0];

  /**
   * Automatically resets counter if calendar date changes
   */
  private static ensureDateReset(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastPingDate !== today) {
      this.pingsSentTodayCount = 0;
      this.lastPingDate = today;
    }
  }

  /**
   * Maximum safety cap enforced per mode:
   * QUIET = 0
   * BALANCED = 3
   * COMPANION = 5
   */
  public static getModeSafetyCap(mode: ProactiveSetting['mode']): number {
    switch (mode) {
      case 'QUIET':
        return 0;
      case 'BALANCED':
        return 3;
      case 'COMPANION':
        return 5;
    }
  }

  /**
   * Authoritative effective maximum:
   * effectiveMax = min(settings.maxPingsPerDay, modeSafetyCap)
   * The user's configured maximum must never be exceeded.
   */
  public static getEffectiveMaxPings(settings: ProactiveSetting): number {
    const modeCap = this.getModeSafetyCap(settings.mode);
    const userMax = typeof settings.maxPingsPerDay === 'number' ? settings.maxPingsPerDay : modeCap;
    return Math.max(0, Math.min(userMax, modeCap));
  }

  /**
   * Determines if proactive contact is allowed right now based on settings, time, and daily limits
   */
  public static canSendProactivePing(settings: ProactiveSetting): { allowed: boolean; reason?: string } {
    this.ensureDateReset();

    if (settings.isPaused) {
      return { allowed: false, reason: 'Proactivity is temporarily paused by user' };
    }

    if (settings.mode === 'QUIET') {
      return { allowed: false, reason: 'Mode is set to Quiet (reactive only, 0 outbound pings permitted)' };
    }

    // Daily notification frequency limit: effectiveMax = min(userConfigured, modeCap)
    const effectiveMax = this.getEffectiveMaxPings(settings);
    if (this.pingsSentTodayCount >= effectiveMax) {
      return {
        allowed: false,
        reason: `Daily frequency limit reached (${this.pingsSentTodayCount}/${effectiveMax} pings sent today; user max: ${settings.maxPingsPerDay}, ${settings.mode} safety cap: ${this.getModeSafetyCap(settings.mode)})`,
      };
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    // Quiet hours check
    if (settings.quietHoursStart > settings.quietHoursEnd) {
      // Overnight (e.g., 22:00 to 08:00)
      if (currentFormatted >= settings.quietHoursStart || currentFormatted < settings.quietHoursEnd) {
        return { allowed: false, reason: `Within scheduled Quiet Hours (${settings.quietHoursStart}–${settings.quietHoursEnd})` };
      }
    } else {
      if (currentFormatted >= settings.quietHoursStart && currentFormatted < settings.quietHoursEnd) {
        return { allowed: false, reason: `Within scheduled Quiet Hours (${settings.quietHoursStart}–${settings.quietHoursEnd})` };
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

    // Trigger 1: Important meeting follow-up
    const reviewMem = memories.find(m => m.key === 'design_review_marcus');
    if (reviewMem && settings.allowMeetingFollowUps) {
      this.pingsSentTodayCount++;
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

    // Trigger 2: Evening wind-down when low battery
    if (context.primaryState === 'LOW_BATTERY' && settings.allowWindDownSuggestions) {
      this.pingsSentTodayCount++;
      return {
        id: `proact_${Date.now()}_winddown`,
        sender: 'ASSISTANT',
        text: 'Noticed your battery is running on low tonight after a long week. Would you like a quiet ambient album to reset, or should I leave you in peace?',
        timestamp: new Date().toISOString(),
        isProactive: true,
        proactiveReason: 'Low battery detected during evening hours',
        suggestedReplies: [
          'Put on something quiet and low-effort.',
          'I’m good, just heading to sleep soon.',
        ],
      };
    }

    // Trigger 3: Concert tour radar alert
    if (settings.allowConcertAlerts) {
      const concertMem = memories.find(m => m.key === 'live_shows_preference');
      if (concertMem) {
        this.pingsSentTodayCount++;
        return {
          id: `proact_${Date.now()}_concert`,
          sender: 'ASSISTANT',
          text: 'Ticket radar alert: Japanese Breakfast just added an intimate date at Thalia Hall. Presale starts tomorrow at 10 AM.',
          timestamp: new Date().toISOString(),
          isProactive: true,
          proactiveReason: 'Tracked artist intimate date announcement at favored venue',
          sourceMemoryTrigger: concertMem.id,
          suggestedReplies: [
            'Place a hold on my Google Calendar for the presale.',
            'Show details and ticket prices.',
          ],
        };
      }
    }

    return null;
  }

  public static getPingsSentTodayCount(): number {
    this.ensureDateReset();
    return this.pingsSentTodayCount;
  }

  public static getLastPingDate(): string {
    return this.lastPingDate;
  }

  public static resetPingsSentToday(): void {
    this.pingsSentTodayCount = 0;
    this.lastPingDate = new Date().toISOString().split('T')[0];
  }
}
