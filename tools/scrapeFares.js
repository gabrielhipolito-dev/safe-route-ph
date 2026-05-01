#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { scrapeFareFromUrl, saveScrapedFare } from '../app/lib/fareScraper.js'

const cfgPath = path.join(process.cwd(), 'tools', 'fareSources.json')

async function run() {
  if (!fs.existsSync(cfgPath)) {
    console.error('No fareSources.json found')
    process.exit(1)
  }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
  for (const source of cfg) {
    try {
      console.log('Scraping', source.url)
      const fares = await scrapeFareFromUrl(source.url, source.selector)
      console.log('Found fares', fares)
      saveScrapedFare(source.key, { url: source.url, fares, updatedAt: new Date().toISOString() })
    } catch (e) {
      console.error('Error scraping', source.url, e.message)
    }
  }
}

run()
