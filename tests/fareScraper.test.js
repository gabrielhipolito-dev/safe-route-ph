import fs from 'fs'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('node-fetch', () => ({
  default: vi.fn(),
}))

const { scrapeFareFromUrl, readScrapedFares, saveScrapedFare } = await import(
  '../app/lib/fareScraper.js'
)
const fetchMock = (await import('node-fetch')).default

const dataPath = path.join(process.cwd(), 'data', 'scraped_fares.json')

const cleanupDataFile = () => {
  if (fs.existsSync(dataPath)) {
    fs.unlinkSync(dataPath)
  }
}

beforeEach(() => {
  cleanupDataFile()
})

afterEach(() => {
  cleanupDataFile()
  vi.resetAllMocks()
})

describe('fareScraper', () => {
  it('scrapes numeric fares from HTML', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<div class="fare">₱20.50 and 30</div>',
    })

    const result = await scrapeFareFromUrl('https://example.com', '.fare')
    expect(result).toEqual([20.5, 30])
  })

  it('throws when fetch fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(scrapeFareFromUrl('https://example.com', '.fare')).rejects.toThrow(
      'Fetch failed: 500'
    )
  })

  it('saves and reads scraped fares', () => {
    saveScrapedFare('jeepney', { min: 15, max: 25 })
    saveScrapedFare('train', { min: 20, max: 40 })

    const data = readScrapedFares()
    expect(data).toEqual({
      jeepney: { min: 15, max: 25 },
      train: { min: 20, max: 40 },
    })
  })

  it('resets corrupted fare data when saving', () => {
    fs.writeFileSync(dataPath, '{ invalid json', 'utf8')

    saveScrapedFare('uv', { min: 18, max: 30 })
    const data = readScrapedFares()

    expect(data).toEqual({
      uv: { min: 18, max: 30 },
    })
  })
})
