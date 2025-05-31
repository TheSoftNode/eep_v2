import { ClockIcon, CloudIcon, CodeIcon, DatabaseIcon, FolderGitIcon, GlobeIcon, KeyIcon, LayoutIcon, RocketIcon, ServerIcon } from "lucide-react";
import { FaFlask } from "react-icons/fa";

export const masteryModules = [
  {
    title: "AWS Basics",
    description: "Gain hands-on experience with AWS core services, including Lambda, EventBridge, IAM, and S3, to build scalable cloud solutions.",
    icon: CloudIcon,
  },
  {
    title: "Serverless with Lambda & EventBridge",
    description: "Master event-driven architectures by creating serverless applications with AWS Lambda and EventBridge, optimizing performance and efficiency.",
    icon: RocketIcon,
  },
  {
    title: "Flask API Development",
    description: "Develop RESTful APIs using Flask, integrating seamlessly with DynamoDB and SQL databases for robust backend solutions.",
    icon: FaFlask,
  },
  {
    title: "JWT Authentication",
    description: "Implement JWT-based authentication for secure API access, ensuring safe token management and user verification.",
    icon: KeyIcon,
  },
  {
    title: "SQL & DynamoDB",
    description: "Understand SQL fundamentals and work with DynamoDB to manage structured and unstructured data, learning when to use NoSQL vs. SQL.",
    icon: DatabaseIcon,
  },
  {
    title: "Automated Scheduling with Cron Jobs",
    description: "Set up and manage Unix cron jobs and AWS EventBridge for task automation, ensuring seamless background operations.",
    icon: ClockIcon,
  },
  {
    title: "CI/CD & Deployment",
    description: "Build CI/CD pipelines with GitHub Actions, deploy applications on Render, and automate updates for smooth and efficient software releases.",
    icon: RocketIcon,
  },
  {
    title: "Web Development Basics and Roadmap",
    description: "Understand the fundamentals of web development, including client-server architecture, HTTP protocols, and the web development lifecycle. Build a clear roadmap to guide your learning journey.",
    icon: GlobeIcon,
  },
  {
    title: "Frontend Development from Scratch",
    description: "Learn to create responsive and interactive user interfaces using HTML, CSS, and JavaScript. Master DOM manipulation, event handling, and styling techniques to build engaging web pages.",
    icon: LayoutIcon,
  },
  {
    title: "Advanced Frontend Development",
    description: "Dive into modern frontend frameworks like React and Next.js. Build dynamic, high-performance web applications with reusable components, state management, and server-side rendering.",
    icon: CodeIcon,
  },
  {
    title: "Backend Development",
    description: "Develop robust backend systems using popular frameworks like Node.js, Django, NestJS, and .NET. Learn to create RESTful APIs, handle authentication, and manage server-side logic.",
    icon: ServerIcon,
  },
  {
    title: "Database Design and Structuring",
    description: "Gain expertise in designing and structuring databases for optimal performance. Learn relational and non-relational database concepts, schema design, and query optimization for scalable applications.",
    icon: DatabaseIcon,
  },
  {
    title: "Git and GitHub",
    description: "Master version control with Git and GitHub. Learn essential commands, branching strategies, and collaboration workflows to manage codebases effectively. Gain hands-on experience with pull requests, code reviews, and repository management.",
    icon: FolderGitIcon,
  }
];


export const testimonials = [
  {
    content: "Through EEP, I am able to learn coding faster. It is so convenient to just install and set up environment and dependencies, ask AI about my code, as well as deploy my application for testing in just one platform.",
    author: "Thang Dang",
    role: "IoT Programmer and Developer",
    avatar: "/testmonials/profile-photo.png",
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    iconColor: "text-blue-400"
  },
  {
    content: "As a mentor in the EEp program, I've witnessed firsthand the incredible impact this initiative has on participants. The program not only equips individuals with cutting-edge AI knowledge but also fosters an environment of collaboration and growth. It's been a rewarding experience to guide and support talented learners as they explore the integration of AI into education. The EEp program empowers participants to think creatively, tackle real-world challenges, and develop the skills necessary to make a meaningful impact in the education sector. I'm proud to be part of such an innovative and forward-thinking program.",
    author: "Shenal Elekuttige",
    role: "Mentor",
    avatar: "/testmonials/shenalphoto.jpg",
    gradient: "from-indigo-50 to-violet-50",
    border: "border-indigo-100",
    iconColor: "text-indigo-400"
  },
  {
    content: `Excited to share my latest achievement! 
I successfully completed the Enterprise Engagement Program (EEP) in Software Development with a Focus on AI-Enabled Technology from HitoAI Limited.
During this incredible journey, I had the opportunity to work on cutting-edge AI,gaining hands-on experience in developing intelligent systems and integrating IoT solutions. This experience has deepened my understanding of AI algorithms, IoT connectivity, and real-world problem-solving.

This journey has significantly enhanced my skills in software development and AI integration, and I'm excited to apply these skills to future projects.`,
    author: "Swati Mandaokar",
    role: "Software Developer",
    avatar: "/testmonials/professional-photo.jpg",
    gradient: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    iconColor: "text-violet-400"
  },
  {
    content: `EEP accelerated my growth as a full-stack developer and helped me bridge the gap into AI and IoT. Their structured mentorship and hands-on projects gave me the confidence to build smarter systems—now I ship code faster and think like an engineer.`,
    author: "Jibin John",
    role: "Software Developer",
    avatar: "/testmonials/jibin.jpg",
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    iconColor: "text-blue-400"
  },
  {
    content: `The Enterprise Engagement Program (EEP) at HitoAI was an incredible learning experience that provided hands-on exposure to AI-enabled software development. Over three months, I had the opportunity to work on real-world projects, developing REST APIs, integrating AI-powered solutions, and deploying applications. The program helped me enhance my technical skills and gain practical experience in AI-driven development.`,
    author: "Aswanth  Manoharan",
    role: "Software Developer",
    avatar: "/testmonials/aswanth.jpeg",
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    iconColor: "text-blue-400"
  },
];