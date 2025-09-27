"use client"

import { GoogleAnalytics } from 'nextjs-google-analytics'
import React from 'react'

export default function GoogleAnalyticsProvider() {
  return <GoogleAnalytics trackPageViews gaMeasurementId={process.env.NEXT_PUBLIC_GA_ID!} />
}
