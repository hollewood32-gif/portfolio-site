// The resume, in one place. Both the Resume section of the page and the
// downloadable PDF are built from this file, so they can never disagree.
// To update the resume: edit this file, open a PR, merge, approve.
//
// Never add a phone number or street address here: this is published.

export interface ResumeEntry {
  title: string;
  org: string; // where (company, school, website); "" to leave the line out
  dates: string;
  bullets: string[];
}

export interface Resume {
  name: string;
  location: string;
  links: { label: string; url: string }[];
  summary: string;
  skills: { label: string; items: string }[];
  projects: ResumeEntry[];
  experience: ResumeEntry[];
  education: ResumeEntry[];
  certifications: string[];
}

export const resume: Resume = {
  name: "Jeffrey Doughty",
  location: "Orange County, CA",
  // Shown in the PDF's header line only (the page has its own Contact section).
  links: [
    { label: "jeff@jeffreydoughty.com", url: "mailto:jeff@jeffreydoughty.com" },
    { label: "jeffreydoughty.com", url: "https://jeffreydoughty.com" },
    { label: "github.com/hollewood32-gif", url: "https://github.com/hollewood32-gif" },
  ],
  summary:
    "U.S. Navy veteran and former nuclear equipment technician who now builds and ships web software. " +
    "I take projects from first commit to production with pull requests, automated tests and staged deploys: " +
    "the same procedure-driven discipline I learned maintaining reactor systems.",
  skills: [
    { label: "Languages", items: "TypeScript, JavaScript, HTML, CSS, SQL" },
    { label: "Practices", items: "Git, GitHub pull requests, automated testing (Vitest), linting, type-checking" },
    {
      label: "Cloud and delivery",
      items: "CI/CD with GitHub Actions, Cloudflare Workers, Cloudflare D1, custom domains and DNS, infrastructure as code",
    },
    {
      label: "Electrical",
      items: "Troubleshooting and diagnostics, AC/DC, motors and control systems, preventive maintenance",
    },
  ],
  projects: [
    {
      title: "Ragdoll Fling",
      org: "fling.jeffreydoughty.com",
      dates: "2026",
      bullets: [
        "Built a browser physics game in TypeScript with Matter.js and HTML Canvas, playable with a mouse or a touchscreen.",
        "Set up a CI/CD pipeline: every pull request is linted, type-checked, tested and gets a preview link; merges deploy to staging, and production deploys after manual approval.",
        "Added an online leaderboard: an API on Cloudflare Workers with a D1 database, migrations run by the pipeline, server-side validation and rate limiting.",
      ],
    },
    {
      title: "Portfolio website",
      org: "jeffreydoughty.com",
      dates: "2026",
      bullets: [
        "Built with Vite and TypeScript on the same pipeline. The page's resume and this PDF are generated from one data file at build time.",
      ],
    },
  ],
  experience: [
    {
      title: "Customer Service Associate",
      org: "Vons (Fresh Cut, Drive Up & Go, Bakery)",
      dates: "Jan 2021 – Present",
      bullets: [
        "Communicate with customers and handle transactions accurately while managing high-volume workloads.",
        "Maintain safety, sanitation and quality standards in food preparation areas.",
        "Work reliably across several departments as part of the team.",
      ],
    },
    {
      title: "Nuclear Equipment Technician (E4NMM)",
      org: "United States Navy",
      dates: "Nov 2018 – Aug 2020",
      bullets: [
        "Followed nuclear operational and safety procedures to keep personnel and the environment safe.",
        "Ran surveillance tests to verify equipment performance and compliance.",
        "Monitored reactor systems to identify inefficiencies, hazards and maintenance needs.",
        "Troubleshot problems and documented system conditions accurately.",
      ],
    },
  ],
  education: [
    { title: "Cyber Security Specialist", org: "", dates: "2023", bullets: [] },
    {
      title: "Electrical Technician",
      org: "Intercoast College",
      dates: "2022",
      bullets: [
        "Coursework: electrical construction, digital logic and motor control, electronics theory and control systems.",
      ],
    },
  ],
  certifications: ["OSHA 10", "CPR", "Forklift certified", "Electrical Trainee (ET) card (pending)"],
};
