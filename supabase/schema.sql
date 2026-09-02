-- 1. 建立学生提交的租房记录表
CREATE TABLE IF NOT EXISTS public.student_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  university text NOT NULL,
  student_email text NOT NULL UNIQUE,
  community_name text NOT NULL,
  address text,
  district text DEFAULT '福田区',
  monthly_rent integer NOT NULL,
  rental_type text NOT NULL,
  bedroom_count integer,
  commute_minutes integer,
  nearest_port text,
  review text,
  lat double precision,
  lng double precision,
  housing_source text DEFAULT '其他'
);

-- 开启 Row Level Security (RLS)
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户 (Anon) 插入与更新数据 (支持一人一票 upsert 免登录提交)
CREATE POLICY "Allow anonymous inserts" 
ON public.student_submissions 
FOR INSERT TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous updates" 
ON public.student_submissions 
FOR UPDATE TO anon 
USING (true)
WITH CHECK (true);

-- 允许匿名用户 (Anon) 读取数据
CREATE POLICY "Allow anonymous selects" 
ON public.student_submissions 
FOR SELECT TO anon 
USING (true);

-- 2. 创建访问与交互埋点统计表 site_analytics
CREATE TABLE IF NOT EXISTS public.site_analytics (
  event_name text PRIMARY KEY,
  count bigint DEFAULT 0 NOT NULL,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.site_analytics (event_name, count) VALUES
  ('map_opened', 0),
  ('form_opened', 0),
  ('form_completed', 0)
ON CONFLICT (event_name) DO NOTHING;

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read analytics" 
ON public.site_analytics FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon update analytics" 
ON public.site_analytics FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon insert analytics" 
ON public.site_analytics FOR INSERT TO anon WITH CHECK (true);

-- 创建原子自增存储过程，方便前端快速上报埋点
CREATE OR REPLACE FUNCTION public.increment_analytic_counter(event_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.site_analytics (event_name, count, last_updated)
  VALUES (event_type, 1, now())
  ON CONFLICT (event_name) 
  DO UPDATE SET 
    count = public.site_analytics.count + 1,
    last_updated = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_analytic_counter(text) TO anon;


-- 2. 创建聚合视图 (View)，实时计算小区的聚合数据以供前端地图使用
CREATE OR REPLACE VIEW public.map_markers AS
SELECT 
  community_name AS name,
  MAX(district) AS district,
  MAX(address) AS address,
  AVG(lng) AS lng,
  AVG(lat) AS lat,
  COUNT(*) AS total_students,
  ROUND(AVG(monthly_rent)) AS avg_rent,
  MIN(monthly_rent) AS min_rent,
  MAX(monthly_rent) AS max_rent,
  MAX(nearest_port) AS nearest_port,
  ROUND(AVG(commute_minutes)) AS commute_minutes,
  -- 计算房源类型分布比例 (转换为整数百分比)
  jsonb_build_object(
    'entire', COALESCE(ROUND((SUM(CASE WHEN rental_type = 'entire' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100), 0),
    'shared', COALESCE(ROUND((SUM(CASE WHEN rental_type = 'shared' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100), 0),
    'single', COALESCE(ROUND((SUM(CASE WHEN rental_type = 'single' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100), 0)
  ) AS rental_types,
  -- 聚合学校分布
  (
    SELECT jsonb_object_agg(uni_count.university, uni_count.count)
    FROM (
      SELECT university, count(*)
      FROM public.student_submissions s3
      WHERE s3.community_name = s1.community_name
      GROUP BY university
    ) uni_count
  ) AS university_distribution,
  -- 获取最新 3 条评价
  (
    SELECT array_agg(review) 
    FROM (
      SELECT review 
      FROM public.student_submissions s2 
      WHERE s2.community_name = s1.community_name 
        AND s2.review IS NOT NULL 
        AND s2.review != ''
      ORDER BY created_at DESC 
      LIMIT 3
    ) subq
  ) AS reviews
FROM public.student_submissions s1
GROUP BY community_name;
