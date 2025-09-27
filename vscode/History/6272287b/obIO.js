export function projectsArray() {
  const projects = [
    {
      image: "./assets/projects/project-1.webp",
      alt: "project-1.webp",
      link: "https://jahidulkanchan.github.io/Devzet_Task",
    },
    {
      image: "./assets/projects/pixoranest.png",
      alt: "pixoranest",
      link: "https://jahidulkanchan.github.io/Devzet_Task",
    },
    {
      image: "./assets/projects/edu-genius.webp",
      alt: "edu-genius.webp",
      link: "https://edu-genius.vercel.app/",
    },
    {
      image: "./assets/projects/tariqul-portfolio.webp",
      alt: "tariqul-portfolio.png",
      link: "https://tariqul.vercel.app",
    },
    {
      image: "./assets/projects/projoss-digital.webp",
      alt: "projoss-digital.png",
      link: "https://projoss.com/digital/",
    },
    {
      image: "./assets/projects/natural-sefa.webp",
      alt: "natural-sefa.png",
      link: "https://naturalsefa.vercel.app",
    },
    {
      image: "./assets/projects/adtask-ai.webp",
      alt: "adtask-ai.webp",
      link: "https://addtaskai.netlify.app/",
    },
    {
      image: "./assets/projects/joss-creative.webp",
      alt: "https://josscreative.com/",
      link: "https://josscreative.com/",
    },
    {
      image: "./assets/projects/fitness.webp",
      alt: "https://tariqul420.github.io/fitness/",
      link: "https://tariqul420.github.io/fitness/",
    },
    {
      image: "./assets/projects/jagrati-sansthan.webp",
      alt: "jagrati-sansthan.webp",
      link: "https://jagratisansthan.org/",
    },
    {
      image: "./assets/projects/fr-topup.webp",
      alt: "https://frtopup.com/",
      link: "https://frtopup.com/",
    },
    {
      image: "./assets/projects/aesthetic-fitness-gym.webp",
      alt: "https://afg.gliders.dev",
      link: "https://afg.gliders.dev",
    },
    {
      image: "./assets/projects/hey-tools.webp",
      alt: "https://hey-tools.com/",
      link: "https://hey-tools.com/",
    },
  ];
  const container = document.getElementById("project-carousel-container");
  container.innerHTML = projects
    .map(
      (project) => `
      <div class="item group bg-light-dark relative m-[5px] min-h-[200px] overflow-hidden rounded-[7px] border border-[#727272] p-[6px]">
        <img
          width="100"
          height="100"
          src="${project?.image}"
          alt="${project?.alt}"
          class="w-full rounded-[7px]"
        />
        <div class="absolute right-0 bottom-[10px] left-0 mx-auto text-center transition-all duration-300 group-hover:opacity-100 md:opacity-0">
          <a
            href="${project?.link}"
            target="_blank"
            class="btn-primary inline-block font-medium hover:bg-white hover:text-blue-600"
          >Preview</a>
        </div>
      </div>
    `,
    )
    .join("");
}
