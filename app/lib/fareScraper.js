import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const dataPath = path.join(process.cwd(), 'data', 'scraped_fares.json')

export async function scrapeFareFromUrl(url, selector) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)
  const text = $(selector).first().text().trim()
  // Extract numbers (may be multiple fares). Return as array of parsed numbers.
  const matches = text.match(/\d+[\d,.]*/g) || []
  return matches.map((m) => parseFloat(m.replace(/,/g, '')))
}

export function saveScrapedFare(key, payload) {
  let data = {}
  if (fs.existsSync(dataPath)) {
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    } catch {
      data = {}
    }
  }
  data[key] = payload
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
}

export function readScrapedFares() {
  if (!fs.existsSync(dataPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  } catch {
    return {}
  }
}
