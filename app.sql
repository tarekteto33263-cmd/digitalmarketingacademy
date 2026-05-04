
-- ============================================================
-- PHASE 1: FOUNDATION - Utilities & ENUMs
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ENUMs
CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'expired', 'refunded');
CREATE TYPE payment_plan AS ENUM ('one_time', 'installment');
CREATE TYPE payment_currency AS ENUM ('EGP', 'USD');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE submission_status AS ENUM ('pending', 'accepted', 'needs_revision');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE lesson_type AS ENUM ('video', 'pdf', 'quiz', 'assignment');
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- ============================================================
-- PHASE 2: DDL - Tables
-- ============================================================

-- Profiles Table (synced with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Courses Table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    intro_video_url TEXT,
    price_egp NUMERIC(10,2) DEFAULT 0,
    price_usd NUMERIC(10,2) DEFAULT 0,
    installment_price_egp NUMERIC(10,2),
    installment_price_usd NUMERIC(10,2),
    installment_months INTEGER DEFAULT 3,
    total_hours NUMERIC(5,1) DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'ar',
    level TEXT DEFAULT 'beginner',
    requirements TEXT[],
    what_you_learn TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_is_published ON public.courses(is_published);

-- Units Table (8 units per course)
CREATE TABLE public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_units_course_id ON public.units(course_id);
CREATE INDEX idx_units_order ON public.units(course_id, order_index);

-- Lessons Table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    lesson_type lesson_type DEFAULT 'video',
    video_url TEXT,
    video_duration_seconds INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    order_index INTEGER NOT NULL,
    is_free_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_lessons_unit_id ON public.lessons(unit_id);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(unit_id, order_index);

-- Lesson Resources (PDFs, Checklists, Files)
CREATE TABLE public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    file_size_kb INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_lesson_resources_lesson_id ON public.lesson_resources(lesson_id);

-- Coupons Table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type discount_type DEFAULT 'percentage',
    discount_value NUMERIC(10,2) NOT NULL,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    course_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_is_active ON public.coupons(is_active);

-- Enrollments Table
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    status enrollment_status DEFAULT 'pending',
    payment_plan payment_plan DEFAULT 'one_time',
    payment_status payment_status DEFAULT 'pending',
    currency payment_currency DEFAULT 'EGP',
    amount_paid NUMERIC(10,2) DEFAULT 0,
    original_price NUMERIC(10,2) DEFAULT 0,
    coupon_id UUID,
    coupon_code TEXT,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    stripe_payment_intent_id TEXT,
    paymob_order_id TEXT,
    enrolled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_enrollments_payment_status ON public.enrollments(payment_status);

-- Lesson Progress Table
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    course_id UUID NOT NULL,
    unit_id UUID NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    watch_percentage NUMERIC(5,2) DEFAULT 0,
    last_watched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_course_id ON public.lesson_progress(user_id, course_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

-- Quizzes Table
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quizzes_unit_id ON public.quizzes(unit_id);
CREATE INDEX idx_quizzes_course_id ON public.quizzes(course_id);

-- Quiz Questions Table
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

-- Quiz Attempts Table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    quiz_id UUID NOT NULL,
    unit_id UUID NOT NULL,
    course_id UUID NOT NULL,
    answers JSONB,
    score NUMERIC(5,2) DEFAULT 0,
    is_passed BOOLEAN DEFAULT false,
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);

-- Assignments Table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_days INTEGER DEFAULT 7,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_file_types TEXT[] DEFAULT ARRAY['pdf','zip','jpg','png'],
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_assignments_unit_id ON public.assignments(unit_id);
CREATE INDEX idx_assignments_course_id ON public.assignments(course_id);

-- Submissions Table
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    file_url TEXT,
    external_link TEXT,
    notes TEXT,
    status submission_status DEFAULT 'pending',
    feedback TEXT,
    grade NUMERIC(5,2),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- Comments Table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL,
    course_id UUID NOT NULL,
    user_id UUID NOT NULL,
    parent_id UUID,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_comments_lesson_id ON public.comments(lesson_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);

-- Certificates Table
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    certificate_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX idx_certificates_number ON public.certificates(certificate_number);

-- Testimonials Table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name TEXT NOT NULL,
    job_title TEXT,
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    course_id UUID,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX idx_testimonials_course_id ON public.testimonials(course_id);

-- FAQs Table
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_order ON public.faqs(order_index);

-- Lead Captures Table (Landing Page)
CREATE TABLE public.lead_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    source TEXT DEFAULT 'landing_page',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    is_converted BOOLEAN DEFAULT false,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX idx_lead_captures_source ON public.lead_captures(source);
CREATE INDEX idx_lead_captures_is_converted ON public.lead_captures(is_converted);

-- Email Notifications Log Table
CREATE TABLE public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_email_notifications_user_id ON public.email_notifications(user_id);
CREATE INDEX idx_email_notifications_type ON public.email_notifications(notification_type);
CREATE INDEX idx_email_notifications_status ON public.email_notifications(status);

-- ============================================================
-- PHASE 3: LOGIC - Table-Dependent Functions
-- ============================================================

-- Check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_enrolled(_course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = auth.uid()
    AND course_id = _course_id
    AND status = 'active'
    AND payment_status = 'paid'
  );
$$;

-- Check if user is admin or instructor
CREATE OR REPLACE FUNCTION public.is_admin_or_instructor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'instructor')
  );
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Get course completion percentage for a user
CREATE OR REPLACE FUNCTION public.get_course_progress(_user_id UUID, _course_id UUID)
RETURNS NUMERIC
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    CASE
      WHEN COUNT(l.id) = 0 THEN 0
      ELSE ROUND((COUNT(lp.id) FILTER (WHERE lp.is_completed = true) * 100.0) / COUNT(l.id), 2)
    END
  FROM lessons l
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = _user_id
  WHERE l.course_id = _course_id AND l.is_published = true;
$$;

-- ============================================================
-- PHASE 4: SECURITY - RLS Policies
-- ============================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (is_admin());

-- Courses RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR is_admin_or_instructor());
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (is_admin_or_instructor());

-- Units RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published units" ON public.units FOR SELECT USING (is_published = true OR is_admin_or_instructor());
CREATE POLICY "Admins can manage units" ON public.units FOR ALL USING (is_admin_or_instructor());

-- Lessons RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view free preview lessons" ON public.lessons FOR SELECT USING (is_free_preview = true OR is_enrolled(course_id) OR is_admin_or_instructor());
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (is_admin_or_instructor());

-- Lesson Resources RLS
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view resources" ON public.lesson_resources FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM lessons l
    WHERE l.id = lesson_id AND (is_enrolled(l.course_id) OR is_admin_or_instructor())
  )
);
CREATE POLICY "Admins can manage resources" ON public.lesson_resources FOR ALL USING (is_admin_or_instructor());

-- Coupons RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (is_admin());

-- Enrollments RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can create own enrollment" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR ALL USING (is_admin());

-- Lesson Progress RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all progress" ON public.lesson_progress FOR SELECT USING (is_admin());

-- Quizzes RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view quizzes" ON public.quizzes FOR SELECT USING (is_enrolled(course_id) OR is_admin_or_instructor());
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (is_admin_or_instructor());

-- Quiz Questions RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view questions" ON public.quiz_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM quizzes q
    WHERE q.id = quiz_id AND (is_enrolled(q.course_id) OR is_admin_or_instructor())
  )
);
CREATE POLICY "Admins can manage questions" ON public.quiz_questions FOR ALL USING (is_admin_or_instructor());

-- Quiz Attempts RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can create own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage attempts" ON public.quiz_attempts FOR ALL USING (is_admin());

-- Assignments RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view assignments" ON public.assignments FOR SELECT USING (is_enrolled(course_id) OR is_admin_or_instructor());
CREATE POLICY "Admins can manage assignments" ON public.assignments FOR ALL USING (is_admin_or_instructor());

-- Submissions RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id OR is_admin_or_instructor());
CREATE POLICY "Users can create own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending submissions" ON public.submissions FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins can manage submissions" ON public.submissions FOR ALL USING (is_admin_or_instructor());

-- Comments RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view comments" ON public.comments FOR SELECT USING (is_enrolled(course_id) OR is_admin_or_instructor());
CREATE POLICY "Enrolled users can post comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id AND is_enrolled(course_id));
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Certificates RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL USING (is_admin());

-- Testimonials RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (is_approved = true OR is_admin());
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (is_admin());

-- FAQs RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published FAQs" ON public.faqs FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (is_admin());

-- Lead Captures RLS
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert lead capture" ON public.lead_captures FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view lead captures" ON public.lead_captures FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage lead captures" ON public.lead_captures FOR ALL USING (is_admin());

-- Email Notifications RLS
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.email_notifications FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage notifications" ON public.email_notifications FOR ALL USING (is_admin());

-- ============================================================
-- PHASE 5: AUTOMATION - Triggers
-- ============================================================

-- Timestamp Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lesson_resources_updated_at BEFORE UPDATE ON public.lesson_resources FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON public.quiz_attempts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lead_captures_updated_at BEFORE UPDATE ON public.lead_captures FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_email_notifications_updated_at BEFORE UPDATE ON public.email_notifications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- New User Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA - Test Data
-- ============================================================

-- Insert Main Course
INSERT INTO public.courses (
    title, slug, description, short_description,
    thumbnail_url, intro_video_url,
    price_egp, price_usd, installment_price_egp, installment_price_usd, installment_months,
    total_hours, total_lessons, students_count,
    is_published, is_featured, language, level,
    requirements, what_you_learn
) VALUES (
    'احترف التسويق الرقمي والإعلانات الممولة في 60 يوم',
    'digital-marketing-mastery',
    'كورس شامل ومتكامل يأخذك من الصفر إلى الاحتراف في عالم التسويق الرقمي والإعلانات الممولة. ستتعلم كيف تبني استراتيجية تسويقية متكاملة، تدير إعلانات فيسبوك وجوجل باحترافية، وتحلل البيانات لتحقيق أفضل النتائج.',
    'تعلم التسويق الرقمي والإعلانات الممولة من الصفر حتى الاحتراف في 60 يوم فقط',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    2997.00, 97.00, 1197.00, 39.00, 3,
    40.0, 120, 3847,
    true, true, 'ar', 'beginner',
    ARRAY['لا يشترط خبرة سابقة', 'جهاز كمبيوتر أو موبايل', 'اتصال بالإنترنت', 'رغبة حقيقية في التعلم'],
    ARRAY['إنشاء وإدارة إعلانات فيسبوك وإنستجرام', 'إعلانات جوجل وجوجل شوبينج', 'تحسين محركات البحث SEO', 'بناء Funnels مبيعات متكاملة', 'تحليل البيانات بـ Google Analytics', 'بناء خطة تسويقية كاملة']
);

-- Insert 8 Units
INSERT INTO public.units (course_id, title, description, order_index) VALUES
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'أساسيات التسويق الرقمي', 'تعرف على مفاهيم التسويق الرقمي الأساسية وكيف يختلف عن التسويق التقليدي', 1),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'استراتيجية المحتوى', 'تعلم كيف تبني استراتيجية محتوى قوية تجذب جمهورك المستهدف وتحوله لعملاء', 2),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'إعلانات فيسبوك وإنستجرام', 'احترف إنشاء وإدارة وتحسين إعلانات Meta Ads من الصفر', 3),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'إعلانات جوجل ويوتيوب', 'تعلم Google Ads وYouTube Ads وكيف تستهدف العملاء في لحظة البحث', 4),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'تحسين محركات البحث SEO', 'تعلم كيف تظهر موقعك في أول نتائج جوجل مجاناً', 5),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'صفحات الهبوط والـ Funnels', 'بناء صفحات هبوط عالية التحويل وقمع مبيعات متكامل', 6),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'تحليل البيانات Google Analytics', 'تعلم قراءة وتحليل البيانات لاتخاذ قرارات تسويقية صحيحة', 7),
((SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'), 'بناء خطة تسويقية كاملة', 'طبق كل ما تعلمته في بناء خطة تسويقية متكاملة لمشروعك', 8);

-- Insert Sample Lessons for Unit 1
INSERT INTO public.lessons (unit_id, course_id, title, description, lesson_type, video_url, video_duration_seconds, order_index, is_free_preview) VALUES
(
    (SELECT id FROM public.units WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'),
    'مقدمة: ما هو التسويق الرقمي؟',
    'تعرف على مفهوم التسويق الرقمي وأهميته في عالم الأعمال الحديث',
    'video',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    1200, 1, true
),
(
    (SELECT id FROM public.units WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'),
    'قنوات التسويق الرقمي المختلفة',
    'استعراض شامل لجميع قنوات التسويق الرقمي: SEO، SEM، Social Media، Email Marketing',
    'video',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    1800, 2, false
),
(
    (SELECT id FROM public.units WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'),
    'تحديد الجمهور المستهدف Buyer Persona',
    'كيف تحدد جمهورك المستهدف بدقة وتبني شخصية المشتري',
    'video',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    2400, 3, false
);

-- Insert Sample Quiz for Unit 1
INSERT INTO public.quizzes (unit_id, course_id, title, description, passing_score, time_limit_minutes, max_attempts) VALUES
(
    (SELECT id FROM public.units WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'),
    'اختبار الوحدة الأولى: أساسيات التسويق الرقمي',
    'اختبر معلوماتك عن أساسيات التسويق الرقمي',
    70, 15, 3
);

-- Insert Quiz Questions
INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer, explanation, points, order_index) VALUES
(
    (SELECT id FROM public.quizzes WHERE title = 'اختبار الوحدة الأولى: أساسيات التسويق الرقمي'),
    'ما هو الفرق الرئيسي بين التسويق الرقمي والتسويق التقليدي؟',
    '["التسويق الرقمي أرخص دائماً", "التسويق الرقمي يمكن قياسه وتتبعه بدقة", "التسويق التقليدي أكثر فعالية", "لا يوجد فرق بينهما"]',
    'التسويق الرقمي يمكن قياسه وتتبعه بدقة',
    'الميزة الأساسية للتسويق الرقمي هي إمكانية قياس النتائج بدقة عالية وتتبع كل تفاعل',
    1, 1
),
(
    (SELECT id FROM public.quizzes WHERE title = 'اختبار الوحدة الأولى: أساسيات التسويق الرقمي'),
    'ما هو معنى اختصار SEO؟',
    '["Search Engine Optimization", "Social Engagement Online", "Sales Enhancement Operations", "Site Engagement Overview"]',
    'Search Engine Optimization',
    'SEO تعني تحسين محركات البحث وهي عملية تحسين موقعك ليظهر في نتائج البحث المجانية',
    1, 2
),
(
    (SELECT id FROM public.quizzes WHERE title = 'اختبار الوحدة الأولى: أساسيات التسويق الرقمي'),
    'ما هو Buyer Persona؟',
    '["شخصية خيالية تمثل عميلك المثالي", "نوع من الإعلانات", "أداة تحليل بيانات", "منصة تسويقية"]',
    'شخصية خيالية تمثل عميلك المثالي',
    'Buyer Persona هي شخصية خيالية مبنية على بيانات حقيقية تمثل عميلك المثالي',
    1, 3
);

-- Insert Sample Assignment for Unit 1
INSERT INTO public.assignments (unit_id, course_id, title, description, instructions, due_days) VALUES
(
    (SELECT id FROM public.units WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery'),
    'واجب الوحدة الأولى: تحليل منافس',
    'قم بتحليل استراتيجية التسويق الرقمي لأحد منافسيك',
    'اختر منافساً في مجالك وقم بتحليل: 1) قنوات التسويق التي يستخدمها 2) نوع المحتوى الذي ينشره 3) كيف يستهدف جمهوره. قدم تقريراً بصيغة PDF لا يقل عن 3 صفحات.',
    7
);

-- Insert Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, max_uses, valid_until, is_active) VALUES
('WELCOME50', 'percentage', 50.00, 100, NOW() + INTERVAL '30 days', true),
('RAMADAN2024', 'percentage', 30.00, 200, NOW() + INTERVAL '60 days', true),
('FLAT500', 'fixed', 500.00, 50, NOW() + INTERVAL '15 days', true),
('EARLYBIRD', 'percentage', 40.00, 30, NOW() + INTERVAL '7 days', true);

-- Insert Testimonials
INSERT INTO public.testimonials (name, job_title, avatar_url, content, rating, is_featured, order_index) VALUES
(
    'أحمد محمد السيد',
    'مدير تسويق - شركة تقنية',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    'الكورس ده غير حياتي المهنية بالكامل! بعد ما خلصت الكورس، قدرت أزود مبيعات الشركة بنسبة 150% في 3 شهور بس. المحتوى عملي جداً ومش نظري زي باقي الكورسات.',
    5, true, 1
),
(
    'سارة عبدالله',
    'صاحبة مشروع أونلاين',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    'كنت خايفة أبدأ في التسويق الرقمي لأني ما عنديش خبرة، بس الكورس شرح كل حاجة بطريقة بسيطة جداً. دلوقتي بدير إعلاناتي بنفسي ووفرت أكتر من 5000 جنيه شهرياً.',
    5, true, 2
),
(
    'محمود خالد',
    'فريلانسر - مسوق رقمي',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    'أفضل استثمار عملته في حياتي! الكورس مش بس علمني التسويق، علمني كيف أفكر استراتيجياً. دلوقتي بشتغل مع 5 عملاء وبكسب أكتر من وظيفتي القديمة بمرتين.',
    5, true, 3
),
(
    'نورا إبراهيم',
    'مديرة سوشيال ميديا',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    'الوحدة الخاصة بإعلانات فيسبوك وحدها تستاهل سعر الكورس كله! تعلمت أشياء ما كنتش هلاقيها في أي مكان تاني. الدعم الفني ممتاز والمدرب بيرد على كل الأسئلة.',
    5, true, 4
),
(
    'عمر حسن',
    'رائد أعمال',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    'الكورس شامل ومتكامل بشكل مش طبيعي. من أول ما بدأت لحد ما خلصت، كل درس بيضيف قيمة حقيقية. الواجبات العملية هي اللي بتفرق، لأنك بتطبق على الفور.',
    5, false, 5
),
(
    'ريم الشمري',
    'مسوقة محتوى',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    'جربت كتير من الكورسات قبل كده، بس ده الأول اللي حسيت إني بتعلم فعلاً. الشرح واضح، الأمثلة عملية، والمتابعة مستمرة. أنصح بيه أي حد عايز يحترف التسويق.',
    5, false, 6
);

-- Insert FAQs
INSERT INTO public.faqs (question, answer, category, order_index) VALUES
('هل الكورس مناسب للمبتدئين؟', 'نعم! الكورس مصمم خصيصاً للمبتدئين. نبدأ من الصفر ونوصل للاحتراف خطوة بخطوة. لا يشترط أي خبرة سابقة في التسويق.', 'general', 1),
('كم مدة الكورس؟', 'الكورس يحتوي على أكثر من 40 ساعة من المحتوى التعليمي موزعة على 8 وحدات. يمكنك إنهاؤه في 60 يوم بمعدل ساعة يومياً، أو بالسرعة التي تناسبك.', 'general', 2),
('هل سأحصل على شهادة؟', 'نعم! بعد إتمام الكورس واجتياز جميع الاختبارات، ستحصل على شهادة إتمام معتمدة باسمك يمكنك إضافتها لـ LinkedIn وسيرتك الذاتية.', 'certificate', 3),
('ما هي طرق الدفع المتاحة؟', 'نقبل الدفع بالفيزا والماستركارد بالجنيه المصري أو الدولار الأمريكي. يمكنك الدفع مرة واحدة أو بالتقسيط على 3 أشهر.', 'payment', 4),
('هل يمكنني الوصول للكورس مدى الحياة؟', 'نعم! بعد الاشتراك ستحصل على وصول مدى الحياة للكورس وجميع التحديثات المستقبلية مجاناً.', 'general', 5),
('هل هناك دعم فني؟', 'نعم! يمكنك التواصل معنا عبر واتساب للدعم الفني، كما يمكنك طرح أسئلتك في قسم التعليقات تحت كل درس وسيتم الرد عليك خلال 24 ساعة.', 'support', 6),
('هل يمكنني استرداد المبلغ؟', 'نعم! نوفر ضمان استرداد المبلغ كاملاً خلال 7 أيام من الشراء إذا لم تكن راضياً عن الكورس لأي سبب.', 'payment', 7),
('هل الكورس محدث؟', 'نعم! نقوم بتحديث محتوى الكورس باستمرار لمواكبة أحدث التغييرات في خوارزميات فيسبوك وجوجل وأدوات التسويق الرقمي.', 'general', 8);

-- Insert Lesson Resources for first lesson
INSERT INTO public.lesson_resources (lesson_id, title, file_url, file_type, file_size_kb, order_index) VALUES
(
    (SELECT id FROM public.lessons WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    'دليل أساسيات التسويق الرقمي - PDF',
    'https://example.com/resources/digital-marketing-basics.pdf',
    'pdf',
    2048,
    1
),
(
    (SELECT id FROM public.lessons WHERE order_index = 1 AND course_id = (SELECT id FROM public.courses WHERE slug = 'digital-marketing-mastery')),
    'Checklist: خطوات بدء مشروعك الرقمي',
    'https://example.com/resources/digital-checklist.pdf',
    'pdf',
    512,
    2
);
