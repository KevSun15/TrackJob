import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"



export default function Footer(){
  return (
    <footer className="bg-gray-500 pt-4 pb-4 px-15 fixed bottom-0 left-0 w-full flex gap-10 justify-center items-center">
      <div>
        <h1 className="font-bold text-xl text-white pr-7 "> TrackJob </h1>
      </div>
      <div className="flex gap-10 pl-7">
        <a href="https://www.linkedin.com/in/kevin-sun-42ba57294/" className="bg-white rounded-xl p-1">
          <LinkedInLogoIcon width={"25"} height={"25"}/>
        </a>
        <a href="https://github.com/KevSun15" className="bg-white rounded-xl p-1">
          <GitHubLogoIcon width={"25"} height={"25"}/>
        </a>
      </div>
    </footer>
  )
}