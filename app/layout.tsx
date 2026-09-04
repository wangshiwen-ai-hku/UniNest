import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://uninest.aurahk.me'),
  title: 'UniNest 广厦 | 香港高校租房与校友互助透明地图 (uninest.aurahk.me)',
  description: '专为香港各高校（港大HKU、中大CUHK、科大HKUST、理大PolyU、城大CityU等）学生及港硕深住跨境通勤打造的租房与室友互助平台。提供真实校友房源、按生活作息找室友、地铁通勤时间计算与避坑指南。',
  keywords: [
    'UniNest',
    'UniNest广厦',
    '广厦UniNest',
    'UniNest香港',
    'UniNest租房',
    'uninest.aurahk.me',
    'aurahk',
    '香港租房',
    '香港留学租房',
    '港硕租房',
    '香港找室友',
    '港大租房 HKU',
    '港中大租房 CUHK',
    '港科大租房 HKUST',
    '香港理大租房 PolyU',
    '香港城大租房 CityU',
    '港硕深住',
    '福田口岸租房',
    '深圳湾口岸租房'
  ],
  alternates: {
    canonical: 'https://uninest.aurahk.me',
  },
  openGraph: {
    title: 'UniNest 广厦 | 香港高校租房与校友互助透明地图',
    description: '100% 真实校友互助，房源透明、按作息匹配室友、通勤避坑地图。',
    url: 'https://uninest.aurahk.me',
    siteName: 'UniNest 广厦',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased bg-[#F7F7F5] text-[#1C1E21] h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
