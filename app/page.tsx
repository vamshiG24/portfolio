import { About } from "@/components/sections/About";
import { Breakpoints } from "@/components/sections/Breakpoints";
import { Contact } from "@/components/sections/Contact";
import { Home } from "@/components/sections/Home";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";

export default function HomePage() {
  return (
    <>
      <Home />
      <About />
      <Timeline />
      <Skills />
      <Projects />
      <Breakpoints />
      <Contact />
    </>
  );
}
