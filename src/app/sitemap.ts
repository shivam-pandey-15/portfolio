import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://shivampandey.in'

function getPages(dir: string, baseRoute: string = ''): string[] {
    // Prevent crawling hidden dirs or non-route dirs if any
    if (baseRoute.includes('/_') || baseRoute.includes('/api')) return []

    const entries = fs.readdirSync(dir, { withFileTypes: true })
    let routes: string[] = []

    for (const entry of entries) {
        if (entry.isDirectory()) {
            routes = [...routes, ...getPages(path.join(dir, entry.name), `${baseRoute}/${entry.name}`)]
        } else if (entry.name === 'page.tsx') {
            routes.push(baseRoute || '/')
        }
    }
    return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
    const appDir = path.join(process.cwd(), 'src/app')
    const routes = getPages(appDir)

    return routes.map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '/' ? 1 : 0.8,
    }))
}
