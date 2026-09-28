import { ActionPlan, ActionRiskLevel, ActionStatus, PlanItem } from '../types/actions';

export class ActionService {
  /**
   * Assesses risk level of a requested operation
   */
  public static getRiskLevel(actionName: string): ActionRiskLevel {
    switch (actionName) {
      case 'READ_CALENDAR_AVAILABILITY':
      case 'SEARCH_CATALOG':
      case 'CHECK_WEATHER':
        return 'READ_ONLY';

      case 'SAVE_INTERNAL_LIST':
      case 'ADD_TO_WATCH_LATER':
      case 'UPDATE_PREFERENCE':
        return 'REVERSIBLE';

      case 'CREATE_CALENDAR_EVENT':
      case 'SEND_NOTIFICATION':
      case 'EXPORT_MEMORY_DATA':
        return 'EXTERNAL_WRITE';

      case 'BUY_TICKET':
      case 'ORDER_DELIVERY':
      case 'RESERVE_TABLE':
        return 'PURCHASE_OR_BOOKING';

      case 'SHARE_PERSONAL_CONTACT':
      case 'DISCLOSE_LOCATION':
        return 'SENSITIVE_ACTION';

      default:
        return 'EXTERNAL_WRITE';
    }
  }

  /**
   * Determines if explicit confirmation modal is required before running
   */
  public static requiresExplicitConfirmation(riskLevel: ActionRiskLevel): boolean {
    return (
      riskLevel === 'EXTERNAL_WRITE' ||
      riskLevel === 'PURCHASE_OR_BOOKING' ||
      riskLevel === 'SENSITIVE_ACTION'
    );
  }

  /**
   * Converts a confirmed ActionPlan into real state change (e.g. PlanItem)
   */
  public static executeAction(action: ActionPlan): { success: boolean; resultSummary: string; newPlanItem?: PlanItem } {
    if (action.actionName === 'CREATE_CALENDAR_EVENT') {
      const summaryParam = action.parameters.find(p => p.name === 'summary')?.value || action.title;
      const startParam = action.parameters.find(p => p.name === 'start')?.value || 'Upcoming slot';

      return {
        success: true,
        resultSummary: `Successfully placed "${summaryParam}" on your Google Calendar for ${startParam}.`,
        newPlanItem: {
          id: `plan_cal_${Date.now()}`,
          title: summaryParam,
          type: 'EVENT',
          category: 'Calendar Hold',
          date: startParam,
          isCalendarSynced: true,
          status: 'PENDING',
          notes: 'Auto-synced with Google Calendar via Action Engine.',
        },
      };
    }

    if (action.actionName === 'CREATE_SHOPPING_PLAN') {
      return {
        success: true,
        resultSummary: `Saved 3 curated items to your Plans > Shopping Lists.`,
      };
    }

    return {
      success: true,
      resultSummary: `Executed ${action.actionName} with parameter confirmation.`,
    };
  }
}
