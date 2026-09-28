import { MemorySensitivity, MemoryItem } from './memory';

export interface FirewallDecision {
  taskId: string;
  taskIntent: string;
  timestamp: string;
  targetService: 'GEMINI_LLM' | 'EXTERNAL_TOOL' | 'RECOMMENDER' | 'CALENDAR_ADAPTER';
  evaluatedMemoriesCount: number;
  admittedMemories: {
    id: string;
    key: string;
    domain: string;
    sensitivity: MemorySensitivity;
    justification: string;
  }[];
  redactedMemories: {
    id: string;
    key: string;
    sensitivity: MemorySensitivity;
    redactionReason: string;
  }[];
  wasSanitized: boolean;
  privacyConfidenceScore: number; // 0.0 to 1.0
}

export interface PrivacySettings {
  isPrivateSession: boolean;
  masterPersonalizationEnabled: boolean;
  allowSensitiveMemoriesForRecommendations: boolean;
  allowExternalToolsAccess: boolean;
  storeChatTranscriptsPermanently: boolean;
  anonymousTelemetry: boolean;
  applicationLevelEncryptionEnabled: boolean;
  blockedCategories: string[];
}
