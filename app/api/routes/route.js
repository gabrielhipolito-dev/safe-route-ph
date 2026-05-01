import { NextResponse } from 'next/server'
import { getRouteSearchResult } from '../../lib/routeSearch'

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const from = (searchParams.get('from') || '').trim()
	const to = (searchParams.get('to') || '').trim()

	if (!from || !to) {
		return NextResponse.json(
			{
				ok: false,
				message: 'Both from and to are required.',
			},
			{ status: 400 }
		)
	}

	const result = await getRouteSearchResult(from, to)
	if (!result.hasFareData && !result.hasNavigation) {
		return NextResponse.json({
			ok: false,
			message: 'No fare or navigation data found for this route yet.',
			...result,
		})
	}

	return NextResponse.json({
		ok: true,
		...result,
	})
}
