-- 1. 确保 student_submissions 表支持以学生邮箱作为唯一凭证 (防重复填写 / 支持 Upsert)
ALTER TABLE public.student_submissions 
  DROP CONSTRAINT IF EXISTS student_submissions_student_email_key;

ALTER TABLE public.student_submissions 
  ADD CONSTRAINT student_submissions_student_email_key UNIQUE (student_email);

-- 允许匿名用户更新自己的记录 (Upsert)
DROP POLICY IF EXISTS "Allow anonymous updates" ON public.student_submissions;
CREATE POLICY "Allow anonymous updates" 
ON public.student_submissions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 2. 清空之前的测试脏数据
TRUNCATE TABLE public.student_submissions;

-- 3. 创建访问与交互埋点统计表 site_analytics
CREATE TABLE IF NOT EXISTS public.site_analytics (
  event_name text PRIMARY KEY,
  count bigint DEFAULT 0 NOT NULL,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 初始化 3 项核心埋点统计指标
INSERT INTO public.site_analytics (event_name, count) VALUES
  ('map_opened', 0),
  ('form_opened', 0),
  ('form_completed', 0)
ON CONFLICT (event_name) DO NOTHING;

-- 4. 允许匿名用户 (Anon) 对 site_analytics 进行更新和查询
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read analytics" ON public.site_analytics;
CREATE POLICY "Allow anon read analytics" 
ON public.site_analytics FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon update analytics" ON public.site_analytics;
CREATE POLICY "Allow anon update analytics" 
ON public.site_analytics FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert analytics" ON public.site_analytics;
CREATE POLICY "Allow anon insert analytics" 
ON public.site_analytics FOR INSERT TO anon WITH CHECK (true);

-- 5. 创建原子自增存储过程，方便前端快速上报埋点
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

-- 赋权给匿名用户执行该计数函数
GRANT EXECUTE ON FUNCTION public.increment_analytic_counter(text) TO anon;
