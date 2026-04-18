export const PILLARS = ['Performance', 'Rehab', 'Data', "Women's Sports"] as const
export type Pillar = (typeof PILLARS)[number]

export type Article = {
  id: string
  title: string
  category: string
  pillars: Pillar[]
  excerpt?: string
  cardKind?: 'paper' | 'note'
  googleDocUrl?: string
}

/** No published pieces on the site right now — archive is intentionally empty. */
const INITIAL: Omit<Article, 'id'>[] = []

export function seedArticles(): Article[] {
  return INITIAL.map((a, i) => ({
    ...a,
    id: `seed-${i}`,
  }))
}
