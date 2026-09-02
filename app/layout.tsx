import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '广厦 (UniNest) | 港硕深住 · 同学校友租房透明地图',
  description: '专为在深圳租房的香港高校留学生打造的信息透明租房地图。100% 真实港校学生认证，直观查看校友分布、均租、通勤时长与租房避坑指南。',
  keywords: ['香港留学租房', '深圳租房', '港大租房', '港中大租房', '福田口岸租房', '深圳湾口岸', 'UniNest', '广厦'],
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
