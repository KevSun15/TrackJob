import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-400 text-center md:text-left">
          <p className="font-bold text-lg text-white">TrackJob</p>
          <p>A professional Job Board Application</p>
        </div>
        <div className="flex items-center space-x-6">
          <a href="https://www.linkedin.com/in/kevin-sun-42ba57294/" target="_blank" 
            rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300">
            <span className="sr-only">LinkedIn</span>
            <LinkedInLogoIcon width={"24"} height={"24"} />
          </a>
          <a href="https://github.com/KevSun15" target="_blank" rel="noopener noreferrer" 
            className="text-slate-400 hover:text-white transition-colors duration-300">
            <span className="sr-only">GitHub</span>
            <GitHubLogoIcon width={"24"} height={"24"} />
          </a>
        </div>
      </div>
    </footer>
  );
}