import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const email = process.env.GA_CLIENT_EMAIL;
    const key = process.env.GA_PRIVATE_KEY?.split(String.raw`\n`).join("\n");

    if (!propertyId || !email || !key) {
      return NextResponse.json({ items: [], error: "Missing GA envs" });
    }

    // الاعتماد يُمرَّر هنا (عند إنشاء العميل)
    const auth = new google.auth.JWT(
      email,
      undefined,
      key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );
    const analyticsData = google.analyticsdata({ version: "v1beta", auth });

    const res = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`, // يجب أن تكون string
      requestBody: {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: "20", // int64 => string
      },
    });

    const rows = res.data.rows || [];
    return NextResponse.json({
      items: rows.map((r) => ({
        path: r.dimensionValues?.[0]?.value,
        title: r.dimensionValues?.[1]?.value,
        views: Number(r.metricValues?.[0]?.value || "0"),
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message || "error" });
  }
}
