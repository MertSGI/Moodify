import { RecommendationItem, RecommendationCategory } from '../types/recommendation';
import { ContextSnapshot } from '../types/context';
import { MemoryItem } from '../types/memory';
import { TasteNode } from '../types/taste';

export class RecommendationService {
  /**
   * Generates or filters recommendations based on current context, taste graph, and exploration factor.
   * explorationFactor: 0.0 (safe comfort) to 1.0 (novelty/discovery)
   */
  public static getCuration(
    category: RecommendationCategory | 'all',
    context: ContextSnapshot,
    tasteNodes: TasteNode[],
    memories: MemoryItem[],
    explorationFactor: number = 0.35,
    baseList: RecommendationItem[]
  ): RecommendationItem[] {
    // If specific category requested
    let filtered = category === 'all'
      ? baseList
      : baseList.filter(item => item.category === category);

    // Adjust scores based on context and exploration factor
    return filtered.map(item => {
      let dynamicScore = item.score;

      // If user has low energy, boost low-effort recommendations
      if (context.dimensions.energy < 0.4) {
        if (item.metadata.effortLevel === 'VERY_LOW' || item.metadata.effortLevel === 'LOW') {
          dynamicScore += 0.08;
        } else if (item.metadata.effortLevel === 'ACTIVE') {
          dynamicScore -= 0.15;
        }
      }

      // If user has high energy & wants weekend discovery
      if (context.dimensions.energy > 0.6 && context.primaryState === 'ANTICIPATING_WEEKEND') {
        if (item.category === 'events' || item.category === 'places') {
          dynamicScore += 0.12;
        }
      }

      // Exploration factor: if high exploration, boost high noveltyScore items
      if (explorationFactor > 0.5) {
        dynamicScore += item.whyThis.noveltyScore * (explorationFactor - 0.5) * 0.3;
      } else {
        // Safe comfort mode: boost familiar items with lower novelty score
        dynamicScore += (1.0 - item.whyThis.noveltyScore) * (0.5 - explorationFactor) * 0.3;
      }

      return {
        ...item,
        score: Math.min(0.99, Math.max(0.6, dynamicScore)),
      };
    }).sort((a, b) => b.score - a.score);
  }
}
