import type { Priority } from '../../../../types'
import { t } from '../../l10n/en'

export const PriorityTag = ({ priority }: { priority: Priority }) => <span class={`tag ${priority}`}>{t.priority[priority]}</span>

export const XpReward = ({ xp }: { xp: number }) => <span class="reward xp">{t.quest.xp(xp)}</span>

export const GoldReward = ({ gold }: { gold: number }) => <span class="reward gold">{t.quest.gold(gold)}</span>
