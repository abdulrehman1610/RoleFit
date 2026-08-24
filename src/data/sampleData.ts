import { AnalysisResult } from "../types";

export const SAMPLE_RESUMES = {
  senior_swe: {
    title: "Alex Chen — Senior Full-Stack Engineer",
    text: `Alex Chen
San Francisco, CA | alex.chen@example.com | github.com/alexchen-dev | linkedin.com/in/alexchen

SUMMARY
Senior Full-Stack Software Engineer with 6+ years of experience designing and scaling distributed web applications, cloud infrastructure, and microservices. Expert in TypeScript, React, Node.js, PostgreSQL, Docker, and AWS. Proven track record improving system latency by 42% and leading engineering squads of 6 contributors.

PROFESSIONAL EXPERIENCE

Senior Software Engineer | CloudScale Systems (2022 – Present)
• Architected and migrated monolithic dashboard into modular React 18, TypeScript, and Tailwind CSS micro-frontends, reducing initial page load time from 4.2s to 1.1s.
• Designed and implemented high-throughput REST and GraphQL APIs in Node.js / Express handling 18M+ daily requests with 99.98% uptime.
• Managed PostgreSQL database indexing and query optimization, reducing p99 database query latency by 35% across 450GB datasets.
• Spearheaded migration to AWS (ECS, Fargate, RDS, S3, CloudFront) with Terraform IaC, slashing monthly cloud hosting costs by $14,000.
• Mentored 5 junior and mid-level software engineers through code reviews, design docs, and bi-weekly architecture brown-bags.

Software Engineer | NextGen Analytics (2019 – 2022)
• Built real-time analytics data pipelines using Python, Kafka, and Redis caching layers.
• Collaborated with product and UX design teams to ship 14 customer-facing features in React and Redux.
• Automated CI/CD deployment pipelines using GitHub Actions, reducing release cycle time from 3 hours to 12 minutes.
• Authored comprehensive unit and integration test suites using Jest and Cypress, elevating test coverage from 54% to 91%.

EDUCATION & CERTIFICATIONS
• B.S. in Computer Science — University of California, Berkeley (2019)
• AWS Certified Solutions Architect – Associate (2023)

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3/Tailwind
• Frameworks & Libraries: React, Next.js, Node.js, Express, Redux Toolkit, Tailwind CSS, Jest
• Infrastructure & Data: PostgreSQL, Redis, Docker, Kubernetes, AWS (ECS, RDS, S3, IAM), Kafka, Git, CI/CD`
  },

  cloud_ai: {
    title: "Maya Lin — Staff Cloud & AI Systems Engineer",
    text: `Maya Lin
Seattle, WA | maya.lin@example.com | linkedin.com/in/mayalin-cloud

SUMMARY
Staff Cloud & Machine Learning Systems Engineer with 8+ years experience scaling LLM inference pipelines, Kubernetes clusters, and distributed data systems. Hands-on expertise in Python, PyTorch, Go, Terraform, GCP, AWS, and Vector Databases (Pinecone, Qdrant).

EXPERIENCE
Staff Systems Engineer | Apex AI Labs (2023 – Present)
• Spearheaded deployment of enterprise LLM inference service using vLLM, TensorRT-LLM, and Triton on Kubernetes GPU clusters, serving 1,200 token/sec throughput with sub-80ms TTFT.
• Implemented semantic search and RAG retrieval pipelines with hybrid vector indexing, improving contextual precision from 68% to 92%.
• Built distributed telemetry and observability dashboards using Prometheus, Grafana, and OpenTelemetry.

Senior Cloud Infrastructure Engineer | CloudSphere Inc (2018 – 2023)
• Led Kubernetes cluster migration across 3 regions on GCP (GKE), managing 250+ microservices and multi-tenant isolation.
• Created automated multi-cloud disaster recovery strategies with automated failover and 99.99% SLA adherence.

SKILLS
• Python, Go, Rust, PyTorch, HuggingFace, Kubernetes, Terraform, GCP, AWS, Pinecone, Docker, Linux, CI/CD, MLflow`
  }
};

export const SAMPLE_JOB_DESCRIPTIONS = {
  senior_swe_role: {
    title: "Senior Full-Stack Software Engineer (Growth & Platform)",
    text: `Job Title: Senior Full-Stack Software Engineer — Growth & Core Platform
Company: Apex Innovations
Location: Remote (US / Canada) | Full-Time
Comp: $170,000 - $210,000 + Equity + Comprehensive Benefits

ABOUT THE ROLE:
We are seeking an exceptional Senior Full-Stack Software Engineer to drive our core web applications, high-performance API services, and user analytics platform. You will collaborate closely with Staff Architects and Product Directors to build scalable, resilient web systems handling millions of transactions.

WHAT YOU WILL DO:
• Design, build, and maintain production web applications using TypeScript, modern React, Next.js, and Node.js.
• Architect robust distributed microservices and asynchronous queue architectures with Redis, Kafka, and PostgreSQL.
• Drive cloud infrastructure scalability and observability on AWS (ECS, Fargate, Lambda, CloudWatch).
• Champion engineering excellence, writing clean, well-tested code (Jest, Playwright) and guiding junior engineers through architecture reviews.
• Collaborate cross-functionally with product managers, UX designers, and data teams to deliver delightful customer experiences.
• Conduct security hardening and optimize frontend bundle sizes and Core Web Vitals.

QUALIFICATIONS & REQUIREMENTS:
• 5+ years of production experience in full-stack web software development.
• Deep proficiency in TypeScript, React, modern JavaScript, and Node.js backend services.
• Strong experience with relational database design, query tuning, and schema migrations in PostgreSQL or MySQL.
• Practical familiarity with containerization (Docker), orchestration, and AWS cloud ecosystem.
• Proven track record with CI/CD automation, testing frameworks, and monitoring/alerting systems.
• Excellent communication skills and ability to thrive in an autonomous, high-velocity team.

BONUS POINTS:
• Experience with GraphQL or gRPC services.
• Familiarity with Next.js App Router, SSR, or Server Actions.
• Prior experience with Go or Python backend services.`
  },

  staff_ai_role: {
    title: "Staff Machine Learning & Platform Engineer",
    text: `Job Title: Staff Machine Learning & AI Platform Engineer
Company: SynthWave AI
Location: San Francisco, CA / Hybrid
Salary: $210,000 - $260,000 + Top Tier Equity

RESPONSIBILITIES:
• Architect scalable LLM inference and Retrieval-Augmented Generation (RAG) platform using Python, PyTorch, and Kubernetes.
• Build low-latency model serving infrastructure using vLLM, TensorRT, and Triton Inference Server.
• Design hybrid vector search architectures with Pinecone / Weaviate and Elasticsearch.
• Manage GPU cluster resource scheduling, cost optimization, and autoscaling across multi-cloud infrastructure (GCP/AWS).

REQUIREMENTS:
• 7+ years building high-throughput distributed systems and ML inference infrastructure.
• Deep knowledge of Python, CUDA acceleration, Kubernetes operator development, and Vector DBs.
• Experience fine-tuning open-source models (Llama, Mistral) and quantization techniques.`
  }
};

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  matched_skills: [
    "TypeScript & Modern JavaScript",
    "React & Micro-frontends",
    "Node.js & Express API Design",
    "PostgreSQL & Query Optimization",
    "AWS Cloud (ECS, RDS, S3)",
    "Docker & Containerization",
    "CI/CD (GitHub Actions)",
    "Distributed Microservices",
    "Automated Testing (Jest/Cypress)",
    "Engineering Mentorship & Design Docs"
  ],
  missing_skills: [
    "Next.js App Router & SSR Architecture",
    "GraphQL / gRPC Service Definition",
    "Playwright End-to-End Test Suite",
    "Core Web Vitals Metric Optimization",
    "Asynchronous Queue Systems (SQS/BullMQ)"
  ],
  readiness_tier: 4,
  readiness_rationale: "Strong 84% direct qualification alignment. The candidate demonstrates extensive senior-level mastery in the core stack (TypeScript, React, Node.js, PostgreSQL, AWS). Minor gaps exist primarily in specific secondary frameworks (Next.js App Router, GraphQL, Playwright) which are easily bridged given the candidate's deep foundations.",
  qualitative_summary: "Candidate is a Tier 4 (High Fit) Senior Full-Stack Engineer with exemplary achievements in frontend performance optimization (reducing load time from 4.2s to 1.1s) and database query tuning (slashing p99 latency by 35%). To maximize ATS matching and recruiter appeal, emphasize experience with high-throughput API design and incorporate specific mentions of modern SSR concepts and testing automation.",
  rewrite_suggestions: [
    {
      original_bullet: "Architected and migrated monolithic dashboard into modular React 18, TypeScript, and Tailwind CSS micro-frontends, reducing initial page load time from 4.2s to 1.1s.",
      suggested_bullet: "Architected modern React 18 & TypeScript micro-frontends with Tailwind CSS, accelerating Core Web Vitals and cutting initial page load time by 74% (4.2s to 1.1s) for 200k+ active users.",
      rationale: "Quantifies user impact and explicitly targets the Core Web Vitals qualification demanded by the job description.",
      section: "Experience - CloudScale Systems",
      grounding_confidence: 94,
      grounding_tier: "HIGH",
      flagged_unverifiable: false,
      matched_tokens: ["architected", "react", "typescript", "tailwind", "micro-frontends", "4.2s", "1.1s", "page"],
      ungrounded_tokens: ["vitals", "users"]
    },
    {
      original_bullet: "Designed and implemented high-throughput REST and GraphQL APIs in Node.js / Express handling 18M+ daily requests with 99.98% uptime.",
      suggested_bullet: "Engineered scalable Node.js & Express distributed REST and GraphQL API services processing 18M+ daily requests across AWS ECS, sustaining 99.98% uptime and zero critical downtime incidents.",
      rationale: "Connects the Node.js API throughput directly with AWS container infrastructure as emphasized in the role requirements.",
      section: "Experience - CloudScale Systems",
      grounding_confidence: 96,
      grounding_tier: "HIGH",
      flagged_unverifiable: false,
      matched_tokens: ["node.js", "express", "rest", "graphql", "18m", "uptime", "requests", "aws"],
      ungrounded_tokens: ["incidents"]
    },
    {
      original_bullet: "Collaborated with product and UX design teams to ship 14 customer-facing features in React and Redux.",
      suggested_bullet: "Partnered cross-functionally with Product Directors and UX designers in rapid Agile sprints to deliver 14 mission-critical React/TypeScript user workflows, driving customer onboarding retention.",
      rationale: "Aligns collaboration style with the cross-functional stakeholder wording used in the Target Job posting.",
      section: "Experience - NextGen Analytics",
      grounding_confidence: 88,
      grounding_tier: "HIGH",
      flagged_unverifiable: false,
      matched_tokens: ["product", "ux", "design", "14", "react", "features"],
      ungrounded_tokens: ["sprints", "retention"]
    },
    {
      original_bullet: "Authored comprehensive unit and integration test suites using Jest and Cypress, elevating test coverage from 54% to 91%.",
      suggested_bullet: "Established end-to-end automated testing standards leveraging Jest, Cypress, and CI/CD quality gates, boosting overall codebase test coverage from 54% to 91% and eliminating regression defects.",
      rationale: "Emphasizes QA leadership and test automation demanded for senior engineering hires.",
      section: "Experience - NextGen Analytics",
      grounding_confidence: 92,
      grounding_tier: "HIGH",
      flagged_unverifiable: false,
      matched_tokens: ["unit", "jest", "cypress", "test", "coverage", "54%", "91%"],
      ungrounded_tokens: ["defects"]
    }
  ],
  ats_warnings: [
    "High formatting compatibility: Standard chronological layout detected with no unparseable two-column tables.",
    "Recommended Keyword Enhancement: Explicitly cite 'Next.js' and 'GraphQL schema design' in your Skills section to trigger high-scoring ATS keyword filters.",
    "Strong Metric Density: 80% of experience bullets contain quantified metrics (percentages, seconds, throughput, dollar savings). Maintain this high standard."
  ],
  seniority_assessment: "Senior",
  provider_used: "Mock",
  provider_model: "Safe Dev Mock Engine",
  bias_flagged: false,
  bias_warnings: [],
  latency_ms: 240,
  overall_grounding_score: 92,
  timestamp: new Date().toISOString(),
  raw_token_count: {
    resume_words: 320,
    job_words: 280
  }
};
