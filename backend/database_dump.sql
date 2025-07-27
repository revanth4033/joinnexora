--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-07-27 16:44:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 853 (class 1247 OID 16446)
-- Name: enum_Coupons_discountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Coupons_discountType" AS ENUM (
    'percentage',
    'fixed'
);


ALTER TYPE public."enum_Coupons_discountType" OWNER TO postgres;

--
-- TOC entry 856 (class 1247 OID 16452)
-- Name: enum_Courses_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Courses_category" AS ENUM (
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Design',
    'Marketing',
    'Business',
    'Photography',
    'Music',
    'Other',
    'UI/UX Design',
    'Digital Marketing',
    'Video Editing'
);


ALTER TYPE public."enum_Courses_category" OWNER TO postgres;

--
-- TOC entry 859 (class 1247 OID 16474)
-- Name: enum_Courses_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Courses_level" AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
);


ALTER TYPE public."enum_Courses_level" OWNER TO postgres;

--
-- TOC entry 862 (class 1247 OID 16482)
-- Name: enum_Enrollments_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Enrollments_paymentStatus" AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public."enum_Enrollments_paymentStatus" OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 16704)
-- Name: enum_Users_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_gender" AS ENUM (
    'male',
    'female',
    'other',
    'prefer_not_to_say'
);


ALTER TYPE public."enum_Users_gender" OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 16492)
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'student',
    'instructor',
    'admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 16499)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16500)
-- Name: Certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Certificates" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "courseId" uuid NOT NULL,
    "certificateNumber" character varying(255) NOT NULL,
    "issuedAt" timestamp with time zone,
    "certificateUrl" text,
    grade numeric(5,2),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Certificates" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16713)
-- Name: ContactMessages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactMessages" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ContactMessages" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16505)
-- Name: Coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Coupons" (
    id uuid NOT NULL,
    code character varying(255) NOT NULL,
    description character varying(255),
    "discountType" public."enum_Coupons_discountType" NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "minOrderAmount" numeric(10,2) DEFAULT 0,
    "maxUses" integer,
    "currentUses" integer DEFAULT 0,
    "validFrom" timestamp with time zone NOT NULL,
    "validUntil" timestamp with time zone NOT NULL,
    "isActive" boolean DEFAULT true,
    "applicableCourses" uuid[] DEFAULT ARRAY[]::uuid[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Coupons" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16514)
-- Name: Courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Courses" (
    id uuid NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    "shortDescription" character varying(200) NOT NULL,
    category public."enum_Courses_category" NOT NULL,
    level public."enum_Courses_level" NOT NULL,
    price numeric(10,2) NOT NULL,
    "originalPrice" numeric(10,2),
    thumbnail text NOT NULL,
    "totalDuration" integer DEFAULT 0,
    "enrollmentCount" integer DEFAULT 0,
    "ratingAverage" numeric(2,1) DEFAULT 0,
    "ratingCount" integer DEFAULT 0,
    tags character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    prerequisites character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "whatYouWillLearn" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "isPublished" boolean DEFAULT false,
    "publishedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "instructorId" uuid,
    "courseIncludes" text[] DEFAULT ARRAY[]::text[] NOT NULL,
    "previewVideoUrl" text
);


ALTER TABLE public."Courses" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16528)
-- Name: Enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollments" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "courseId" uuid NOT NULL,
    "enrolledAt" timestamp with time zone,
    progress jsonb DEFAULT '[]'::jsonb,
    "completionRate" numeric(5,2) DEFAULT 0,
    "completedAt" timestamp with time zone,
    "certificateIssued" boolean DEFAULT false,
    "paymentStatus" public."enum_Enrollments_paymentStatus" DEFAULT 'pending'::public."enum_Enrollments_paymentStatus",
    "paymentId" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "paymentAmount" numeric(10,2)
);


ALTER TABLE public."Enrollments" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16537)
-- Name: Lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lessons" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    "videoUrl" text NOT NULL,
    duration integer NOT NULL,
    "order" integer NOT NULL,
    "isPreview" boolean DEFAULT false,
    "courseId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "sectionId" uuid
);


ALTER TABLE public."Lessons" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16543)
-- Name: QuizAttempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizAttempts" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "quizId" uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric(5,2) NOT NULL,
    passed boolean NOT NULL,
    "timeSpent" integer,
    "attemptNumber" integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."QuizAttempts" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16549)
-- Name: Quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quizzes" (
    id uuid NOT NULL,
    "courseId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    "passingScore" integer DEFAULT 70,
    "timeLimit" integer,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Quizzes" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16661)
-- Name: Resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resources" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    url text NOT NULL,
    type character varying(255) NOT NULL,
    "courseId" uuid,
    "sectionId" uuid,
    "lessonId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Resources" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16557)
-- Name: Reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reviews" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "courseId" uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    "isApproved" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Reviews" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16651)
-- Name: Sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sections" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    "order" integer NOT NULL,
    "courseId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Sections" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16683)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16563)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(255),
    phone character varying(255),
    password character varying(255),
    role public."enum_Users_role" DEFAULT 'student'::public."enum_Users_role",
    avatar text,
    bio text,
    "isEmailVerified" boolean DEFAULT false,
    "isPhoneVerified" boolean DEFAULT false,
    "resetPasswordToken" character varying(255),
    "resetPasswordExpire" timestamp with time zone,
    "emailVerificationToken" character varying(255),
    "emailVerificationExpire" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    title character varying(100),
    "dateOfBirth" timestamp with time zone,
    gender public."enum_Users_gender",
    country character varying(100),
    state character varying(100),
    city character varying(100),
    address character varying(255),
    "educationLevel" character varying(100),
    institution character varying(150),
    "fieldOfStudy" character varying(100),
    occupation character varying(100),
    linkedin character varying(255),
    website character varying(255),
    "emailVerificationOtp" character varying(10),
    "emailVerificationOtpExpires" timestamp with time zone,
    "resetPasswordOtp" character varying(10),
    "resetPasswordOtpExpires" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 16500)
-- Dependencies: 215
-- Data for Name: Certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Certificates" (id, "studentId", "courseId", "certificateNumber", "issuedAt", "certificateUrl", grade, "createdAt", "updatedAt") FROM stdin;
16f2ec05-0507-467d-8089-25050f7f2c0e	e7676fd3-4659-4600-8290-5491318e71ad	75e3583a-d776-41bf-a1c0-945ea3d9547e	CERT-1753280411062-q53mvf9a6	2025-07-23 19:50:11.063+05:30	/certificates/Revanth_video_editing_1753280411059.pdf	\N	2025-07-23 19:50:11.064+05:30	2025-07-23 19:50:11.064+05:30
7bfcc8ef-5f8a-4486-9af9-f61d51038900	eb496946-d77a-42b2-b09f-d9f9f1ef6d66	75e3583a-d776-41bf-a1c0-945ea3d9547e	CERT-1753281393628-pdzjchnfl	2025-07-23 20:06:33.631+05:30	/certificates/siva_video_editing_1753281393626.pdf	\N	2025-07-23 20:06:33.632+05:30	2025-07-23 20:06:33.632+05:30
611d6f4e-32c1-4e65-bc15-35ec68031633	b29285bb-83ed-42a3-bfb9-c4e9294f66b7	5e32f066-af97-47ae-b360-248cadf515e7	CERT-1753281423270-rrvi55dj9	2025-07-23 20:07:03.27+05:30	/certificates/mahendra_UX_1753281423269.pdf	\N	2025-07-23 20:07:03.27+05:30	2025-07-23 20:07:03.27+05:30
b8b3df22-5026-4369-a9c0-10cd34fc5165	e7676fd3-4659-4600-8290-5491318e71ad	5e32f066-af97-47ae-b360-248cadf515e7	CERT-1753281503472-2p3d7ocou	2025-07-23 20:08:23.473+05:30	/certificates/Revanth_UX_1753281503471.pdf	\N	2025-07-23 20:08:23.474+05:30	2025-07-23 20:08:23.474+05:30
07f27fbd-0d11-417d-960c-5c016aa69884	42bf25ae-9f68-43ab-b626-f106fcdade0b	5e32f066-af97-47ae-b360-248cadf515e7	CERT-1753281605834-s7nc45nlp	2025-07-23 20:10:05.834+05:30	/certificates/Revanth_Banisetti_UX_1753281605833.pdf	\N	2025-07-23 20:10:05.834+05:30	2025-07-23 20:10:05.834+05:30
\.


--
-- TOC entry 4989 (class 0 OID 16713)
-- Dependencies: 227
-- Data for Name: ContactMessages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactMessages" (id, name, email, subject, message, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4978 (class 0 OID 16505)
-- Dependencies: 216
-- Data for Name: Coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Coupons" (id, code, description, "discountType", "discountValue", "minOrderAmount", "maxUses", "currentUses", "validFrom", "validUntil", "isActive", "applicableCourses", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4979 (class 0 OID 16514)
-- Dependencies: 217
-- Data for Name: Courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Courses" (id, title, description, "shortDescription", category, level, price, "originalPrice", thumbnail, "totalDuration", "enrollmentCount", "ratingAverage", "ratingCount", tags, prerequisites, "whatYouWillLearn", "isPublished", "publishedAt", "createdAt", "updatedAt", "instructorId", "courseIncludes", "previewVideoUrl") FROM stdin;
5e32f066-af97-47ae-b360-248cadf515e7	UX	design	design	UI/UX Design	Beginner	11.00	111.00	https://i.postimg.cc/RVLDwMV7/ui-ux.jpg	20	0	4.5	2	{}	{sgd,gfh}	{svgfd,gdhbfg}	t	\N	2025-07-12 12:45:03.964+05:30	2025-07-24 10:07:25.202+05:30	0466551c-af6a-4512-abe5-4d0ad79ec407	{gf,gd}	https://youtu.be/2OlT0n6JlUg?si=huhX7Ay9vhh9NOSw
75e3583a-d776-41bf-a1c0-945ea3d9547e	video editing	short descrption	short descrption	Video Editing	Beginner	122.00	1222.00	https://i.postimg.cc/7PsYWXY8/ve.avif	20	0	4.0	2	{}	{vdfb,trhrgf,shjk}	{nhfym,yhjyhj,tfjfjj}	t	\N	2025-07-20 21:33:08.24+05:30	2025-07-24 10:17:38.955+05:30	0466551c-af6a-4512-abe5-4d0ad79ec407	{"jfhmgj,",hfgj,tjyfm}	https://youtu.be/x6OaIcF3hbQ?si=SYc3vl9ylqYsIndu
\.


--
-- TOC entry 4980 (class 0 OID 16528)
-- Dependencies: 218
-- Data for Name: Enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollments" (id, "studentId", "courseId", "enrolledAt", progress, "completionRate", "completedAt", "certificateIssued", "paymentStatus", "paymentId", "createdAt", "updatedAt", "paymentAmount") FROM stdin;
2c6785db-0104-4575-b3af-c51a23db4e2a	eb496946-d77a-42b2-b09f-d9f9f1ef6d66	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-20 21:37:53.857+05:30	[{"lessonId": "fef3e94e-514a-4e71-aee9-3b12efa507c6", "watchTime": 189, "completedAt": "2025-07-22T15:16:28.539Z"}, {"lessonId": "ff88812b-ff1e-4c6a-aa82-ae6e171d8f40", "watchTime": 0, "completedAt": "2025-07-22T15:16:34.452Z"}]	100.00	2025-07-22 20:46:34.462+05:30	f	completed	pay_QvNkD9GLdVXa9y	2025-07-20 21:37:53.858+05:30	2025-07-22 20:46:34.462+05:30	\N
a25d494a-1b03-49f9-8ff8-2c3ae3d507b2	42bf25ae-9f68-43ab-b626-f106fcdade0b	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-23 20:09:44.529+05:30	[{"lessonId": "45aab600-83d5-4aa7-9fe4-abd18259374c", "watchTime": 985.141, "completedAt": "2025-07-23T14:39:51.223Z"}, {"lessonId": "ffd01671-c21e-4873-92d4-a5241a3c6687", "watchTime": 0, "completedAt": "2025-07-23T14:40:00.414Z"}]	100.00	2025-07-23 20:10:00.416+05:30	f	completed	pay_QwXqTmCA00cY6K	2025-07-23 20:09:44.529+05:30	2025-07-23 20:10:00.416+05:30	\N
4e802d9f-5b4d-44d4-8585-fca24cc91af5	eb496946-d77a-42b2-b09f-d9f9f1ef6d66	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-24 10:06:25.359+05:30	[{"lessonId": "45aab600-83d5-4aa7-9fe4-abd18259374c", "watchTime": 986, "completedAt": "2025-07-24T04:36:56.313Z"}, {"lessonId": "ffd01671-c21e-4873-92d4-a5241a3c6687", "watchTime": 0, "completedAt": "2025-07-24T04:37:18.483Z"}]	100.00	2025-07-24 10:07:18.504+05:30	f	completed	pay_Qwm6IXhLIJdmr4	2025-07-24 10:06:25.374+05:30	2025-07-24 10:07:18.505+05:30	\N
2ae41e74-9127-4b6f-b77f-e38a76d668c2	b29285bb-83ed-42a3-bfb9-c4e9294f66b7	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-24 10:17:09.774+05:30	[{"lessonId": "fef3e94e-514a-4e71-aee9-3b12efa507c6", "watchTime": 189, "completedAt": "2025-07-24T04:47:25.706Z"}, {"lessonId": "ff88812b-ff1e-4c6a-aa82-ae6e171d8f40", "watchTime": 0, "completedAt": "2025-07-24T04:47:31.192Z"}]	100.00	2025-07-24 10:17:31.213+05:30	f	completed	pay_QwmHdfiUp36yO3	2025-07-24 10:17:09.78+05:30	2025-07-24 10:17:31.217+05:30	\N
d04ff432-48c2-4c23-818e-869c25e46afd	e7676fd3-4659-4600-8290-5491318e71ad	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-13 11:58:48.284+05:30	[{"lessonId": "45aab600-83d5-4aa7-9fe4-abd18259374c", "watchTime": 986, "completedAt": "2025-07-21T15:01:48.579Z"}, {"lessonId": "ffd01671-c21e-4873-92d4-a5241a3c6687", "watchTime": 742.401, "completedAt": "2025-07-21T15:01:52.863Z"}]	100.00	2025-07-21 20:31:52.869+05:30	f	completed	pay_QsS8evZmaM7ubD	2025-07-13 11:58:48.285+05:30	2025-07-21 20:31:52.869+05:30	\N
5a7f628b-62e3-4cf5-887f-91ce78dbc411	e7676fd3-4659-4600-8290-5491318e71ad	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-21 18:38:46.325+05:30	[{"lessonId": "fef3e94e-514a-4e71-aee9-3b12efa507c6", "watchTime": 189, "completedAt": "2025-07-21T15:04:12.818Z"}, {"lessonId": "ff88812b-ff1e-4c6a-aa82-ae6e171d8f40", "watchTime": 0, "completedAt": "2025-07-21T15:04:24.398Z"}]	100.00	2025-07-21 20:34:24.403+05:30	f	completed	pay_QvjE8MKSgwE8Uu	2025-07-21 18:38:46.326+05:30	2025-07-21 20:34:24.404+05:30	\N
48ab9c84-f499-45d0-96e5-d8e9387b1407	b29285bb-83ed-42a3-bfb9-c4e9294f66b7	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-13 19:57:42.784+05:30	[{"lessonId": "45aab600-83d5-4aa7-9fe4-abd18259374c", "watchTime": 986, "completedAt": "2025-07-22T15:14:51.362Z"}, {"lessonId": "ffd01671-c21e-4873-92d4-a5241a3c6687", "watchTime": 0, "completedAt": "2025-07-22T15:15:00.863Z"}]	100.00	2025-07-22 20:45:00.904+05:30	f	completed	pay_QsaIYfflUV3flS	2025-07-13 19:57:42.785+05:30	2025-07-22 20:45:00.905+05:30	\N
\.


--
-- TOC entry 4981 (class 0 OID 16537)
-- Dependencies: 219
-- Data for Name: Lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lessons" (id, title, description, "videoUrl", duration, "order", "isPreview", "courseId", "createdAt", "updatedAt", "sectionId") FROM stdin;
45aab600-83d5-4aa7-9fe4-abd18259374c	Intro of UI	UI is good....	https://youtu.be/HxpINZdxtNs?si=t7aJDDeA0OdZ_KvY	10	1	t	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-12 16:54:24.761+05:30	2025-07-12 16:54:24.761+05:30	3f48e0f8-7c20-496b-aa96-74bf81d65dfe
ffd01671-c21e-4873-92d4-a5241a3c6687	Intro of UX 	UX is life....	https://youtu.be/SUXU72cb_T0?si=JBL9XR8XV5FzNs0L	10	1	t	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-12 16:54:46.635+05:30	2025-07-12 16:54:46.635+05:30	3f48e0f8-7c20-496b-aa96-74bf81d65dfe
fef3e94e-514a-4e71-aee9-3b12efa507c6	basic color grading	ghcvjhvjhkj	https://youtu.be/x6OaIcF3hbQ?si=SYc3vl9ylqYsIndu	10	1	t	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-20 21:34:35.64+05:30	2025-07-20 21:34:35.64+05:30	cc8a5dd9-70c7-4d89-a046-50fcfaf3f9f3
ff88812b-ff1e-4c6a-aa82-ae6e171d8f40	basic cuts 	hgcgfckghvk	https://youtu.be/x6OaIcF3hbQ?si=SYc3vl9ylqYsIndu	10	1	t	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-20 21:34:56.067+05:30	2025-07-20 21:34:56.067+05:30	cc8a5dd9-70c7-4d89-a046-50fcfaf3f9f3
\.


--
-- TOC entry 4982 (class 0 OID 16543)
-- Dependencies: 220
-- Data for Name: QuizAttempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizAttempts" (id, "studentId", "quizId", answers, score, passed, "timeSpent", "attemptNumber", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4983 (class 0 OID 16549)
-- Dependencies: 221
-- Data for Name: Quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quizzes" (id, "courseId", title, description, questions, "passingScore", "timeLimit", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4987 (class 0 OID 16661)
-- Dependencies: 225
-- Data for Name: Resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resources" (id, title, url, type, "courseId", "sectionId", "lessonId", "createdAt", "updatedAt") FROM stdin;
313b2c9d-00d3-4690-b934-82be10466091	Hand Written notes	https://drive.google.com/file/d/1efzlZfcQ-FEtdqpVh4KvBlEOxa_dn7qO/view?usp=sharing	pdf	\N	\N	45aab600-83d5-4aa7-9fe4-abd18259374c	2025-07-23 21:12:41.589+05:30	2025-07-23 21:12:41.589+05:30
12f8d278-3ff2-4c84-8ba5-017173a4b910	hand	https://drive.google.com/file/d/1efzlZfcQ-FEtdqpVh4KvBlEOxa_dn7qO/view?usp=sharing	pdf	\N	\N	45aab600-83d5-4aa7-9fe4-abd18259374c	2025-07-23 21:12:55.026+05:30	2025-07-23 21:12:55.026+05:30
66f91d09-968e-4519-9865-4134a2fa8c5e	hand	https://drive.google.com/file/d/1efzlZfcQ-FEtdqpVh4KvBlEOxa_dn7qO/view?usp=sharing	pdf	\N	\N	45aab600-83d5-4aa7-9fe4-abd18259374c	2025-07-23 21:13:11.645+05:30	2025-07-23 21:13:11.645+05:30
\.


--
-- TOC entry 4984 (class 0 OID 16557)
-- Dependencies: 222
-- Data for Name: Reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reviews" (id, "studentId", "courseId", rating, comment, "isApproved", "createdAt", "updatedAt") FROM stdin;
089e4f51-ac65-4812-afc3-3813b622e35b	e7676fd3-4659-4600-8290-5491318e71ad	5e32f066-af97-47ae-b360-248cadf515e7	5	retmj,kj	t	2025-07-19 00:44:34.723+05:30	2025-07-19 00:44:34.723+05:30
dd67dd42-5f32-4b58-ab91-af766e69f576	e7676fd3-4659-4600-8290-5491318e71ad	75e3583a-d776-41bf-a1c0-945ea3d9547e	4	yed	t	2025-07-21 18:39:13.155+05:30	2025-07-21 18:39:13.155+05:30
4f8d1193-7f42-433e-a237-c9d04073b4f2	eb496946-d77a-42b2-b09f-d9f9f1ef6d66	5e32f066-af97-47ae-b360-248cadf515e7	4	Good	t	2025-07-24 10:07:25.155+05:30	2025-07-24 10:07:25.155+05:30
92c2a130-b382-47fe-b9fb-5b9031c16f4a	b29285bb-83ed-42a3-bfb9-c4e9294f66b7	75e3583a-d776-41bf-a1c0-945ea3d9547e	4	NICE	t	2025-07-24 10:17:38.916+05:30	2025-07-24 10:17:38.916+05:30
\.


--
-- TOC entry 4986 (class 0 OID 16651)
-- Dependencies: 224
-- Data for Name: Sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sections" (id, title, "order", "courseId", "createdAt", "updatedAt") FROM stdin;
3f48e0f8-7c20-496b-aa96-74bf81d65dfe	Introduction	1	5e32f066-af97-47ae-b360-248cadf515e7	2025-07-12 15:26:42.224+05:30	2025-07-12 15:26:42.224+05:30
cc8a5dd9-70c7-4d89-a046-50fcfaf3f9f3	intro of video editing	1	75e3583a-d776-41bf-a1c0-945ea3d9547e	2025-07-20 21:33:58.918+05:30	2025-07-20 21:33:58.918+05:30
\.


--
-- TOC entry 4988 (class 0 OID 16683)
-- Dependencies: 226
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
2024_add_sectionId_to_lessons.js
20250712054439-add_instructor_details.js
20250712060132-add_course_includes_to_courses.js
20250712061437-add_preview_video_to_courses.js
20250712070000-add_user_profile_fields.js
20250712080000-add_otp_fields_to_users.js
20250712090000-create-contact-messages.js
\.


--
-- TOC entry 4985 (class 0 OID 16563)
-- Dependencies: 223
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, phone, password, role, avatar, bio, "isEmailVerified", "isPhoneVerified", "resetPasswordToken", "resetPasswordExpire", "emailVerificationToken", "emailVerificationExpire", "createdAt", "updatedAt", title, "dateOfBirth", gender, country, state, city, address, "educationLevel", institution, "fieldOfStudy", occupation, linkedin, website, "emailVerificationOtp", "emailVerificationOtpExpires", "resetPasswordOtp", "resetPasswordOtpExpires") FROM stdin;
f7f03d20-31df-4306-9388-02bfa308ce2f	tom	tommy@gmail.com	9876543211	$2a$10$6PYtLnMfv5iFUWdtF8Ix.ePtDhQsHegRq7.PyPpVUAdTW6guq..wG	admin	\N	\N	f	f	\N	\N	\N	\N	2025-07-11 15:26:13.443+05:30	2025-07-11 15:26:13.443+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0466551c-af6a-4512-abe5-4d0ad79ec407	John	instructor@example.com	\N	$2a$12$7R9ZUAZTSnetvTJoTKhP8esHEeVtNFSFK0C1roLoMUQXwDTXPsDmm	instructor	https://randomuser.me/api/portraits/men/1.jpg	Experienced instructor in web development.	f	f	\N	\N	\N	\N	2025-07-12 11:29:07.880182+05:30	2025-07-12 11:29:07.880182+05:30	Senior Instructor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b29285bb-83ed-42a3-bfb9-c4e9294f66b7	mahendra	maahi@gmail.com	9874563210	$2a$10$lLxqEXbJ53AIngGirlh3RuBMy8JTanOTsFVoXQ870GAaRc/2ti.Gq	student	\N	\N	f	f	\N	\N	\N	\N	2025-07-13 19:56:40.553+05:30	2025-07-13 19:56:40.553+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
eb496946-d77a-42b2-b09f-d9f9f1ef6d66	siva	siva@gmail.com	9658745123	$2a$10$bFje/hCg/1xcAEXLHMs0q.UWbo3VEFX6po3lGLBZ/Gllk9iQO0pXa	student	\N	\N	f	f	\N	\N	\N	\N	2025-07-20 21:35:39.394+05:30	2025-07-20 21:35:39.394+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e7676fd3-4659-4600-8290-5491318e71ad	Revanth	tom@gmail.com	9876543210	$2a$10$trVFI.xpdnIiiIkJYK/WLudoDeAW1pLk5pZF1wSUnVz814srHVYq2	student	\N	i am a designer	f	f	\N	\N	\N	\N	2025-07-11 15:25:19.321+05:30	2025-07-22 21:57:52.986+05:30	\N	2003-12-05 05:30:00+05:30	male	india	TS	Hyd	Hyd	B tech	HHHH	CSE	BBBBB	\N	\N	\N	\N	\N	\N
c710d19b-6aa8-48d3-8e10-1cd9dd19734d	Mahi	mahendratejak9@gmail.com	9865123457	$2a$10$/f3TupnAbzlQiVhDA0VSPOPW/JRjFzygwrSN8HSO.lTMAuKfZDAGW	student	\N	\N	t	f	\N	\N	\N	\N	2025-07-22 22:44:43.227+05:30	2025-07-22 22:51:32.106+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42bf25ae-9f68-43ab-b626-f106fcdade0b	Revanth Banisetti	tomrevanth403@gmail.com	\N	\N	student	\N	\N	t	f	\N	\N	\N	\N	2025-07-22 23:32:57.467+05:30	2025-07-22 23:32:57.467+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4781 (class 2606 OID 16572)
-- Name: Certificates Certificates_certificateNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificates"
    ADD CONSTRAINT "Certificates_certificateNumber_key" UNIQUE ("certificateNumber");


--
-- TOC entry 4783 (class 2606 OID 16574)
-- Name: Certificates Certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificates"
    ADD CONSTRAINT "Certificates_pkey" PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 16719)
-- Name: ContactMessages ContactMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactMessages"
    ADD CONSTRAINT "ContactMessages_pkey" PRIMARY KEY (id);


--
-- TOC entry 4785 (class 2606 OID 16576)
-- Name: Coupons Coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupons"
    ADD CONSTRAINT "Coupons_code_key" UNIQUE (code);


--
-- TOC entry 4787 (class 2606 OID 16578)
-- Name: Coupons Coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupons"
    ADD CONSTRAINT "Coupons_pkey" PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 16580)
-- Name: Courses Courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16582)
-- Name: Enrollments Enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_pkey" PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 16584)
-- Name: Enrollments Enrollments_studentId_courseId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_studentId_courseId_key" UNIQUE ("studentId", "courseId");


--
-- TOC entry 4796 (class 2606 OID 16586)
-- Name: Lessons Lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pkey" PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 16588)
-- Name: QuizAttempts QuizAttempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_pkey" PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16590)
-- Name: Quizzes Quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_pkey" PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16667)
-- Name: Resources Resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resources"
    ADD CONSTRAINT "Resources_pkey" PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 16592)
-- Name: Reviews Reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16655)
-- Name: Sections Sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sections"
    ADD CONSTRAINT "Sections_pkey" PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16687)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4805 (class 2606 OID 16594)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 4807 (class 2606 OID 16596)
-- Name: Users Users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_phone_key" UNIQUE (phone);


--
-- TOC entry 4809 (class 2606 OID 16598)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 4794 (class 1259 OID 16599)
-- Name: enrollments_student_id_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX enrollments_student_id_course_id ON public."Enrollments" USING btree ("studentId", "courseId");


--
-- TOC entry 4803 (class 1259 OID 16600)
-- Name: reviews_student_id_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reviews_student_id_course_id ON public."Reviews" USING btree ("studentId", "courseId");


--
-- TOC entry 4818 (class 2606 OID 16601)
-- Name: Certificates Certificates_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificates"
    ADD CONSTRAINT "Certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 16606)
-- Name: Certificates Certificates_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificates"
    ADD CONSTRAINT "Certificates_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 16695)
-- Name: Courses Courses_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4821 (class 2606 OID 16611)
-- Name: Enrollments Enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4822 (class 2606 OID 16616)
-- Name: Enrollments Enrollments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4823 (class 2606 OID 16621)
-- Name: Lessons Lessons_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 16688)
-- Name: Lessons Lessons_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Sections"(id);


--
-- TOC entry 4825 (class 2606 OID 16626)
-- Name: QuizAttempts QuizAttempts_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quizzes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4826 (class 2606 OID 16631)
-- Name: QuizAttempts QuizAttempts_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 16636)
-- Name: Quizzes Quizzes_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 16668)
-- Name: Resources Resources_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resources"
    ADD CONSTRAINT "Resources_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id);


--
-- TOC entry 4832 (class 2606 OID 16678)
-- Name: Resources Resources_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resources"
    ADD CONSTRAINT "Resources_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id);


--
-- TOC entry 4833 (class 2606 OID 16673)
-- Name: Resources Resources_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resources"
    ADD CONSTRAINT "Resources_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Sections"(id);


--
-- TOC entry 4828 (class 2606 OID 16641)
-- Name: Reviews Reviews_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 16646)
-- Name: Reviews Reviews_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4830 (class 2606 OID 16656)
-- Name: Sections Sections_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sections"
    ADD CONSTRAINT "Sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id);


-- Completed on 2025-07-27 16:44:20

--
-- PostgreSQL database dump complete
--

