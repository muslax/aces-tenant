import Head from "next/head";
import { useRouter } from "next/router";

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import Personae from "components/project/persona/Personae";
import Link from "next/link";

const PersonaPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id: pid } = router.query;
  const { project, isError, isLoading } = useProject(pid);

  if (isLoading) return <div className="my-8 text-center">...</div>;

  if (isError || user.license._id != project.lid) return <ProjectNotFound />

  return (
    <div>
      <Head>
        <title>{project.title} - ACES</title>
      </Head>

      <Hero project={project} title="Persona" />

      <Personae user={user} project={project} />

      <div className="mt-24 flex justify-center space-x-4 text-gray-300">
        <Link href="/sample-data-usernames.csv">
          <a download="/sample-data-usernames.csv" className="text-blue-500">Sample CSV dengan username</a>
        </Link>
        <span>|</span>
        <Link href="/sample-data.csv">
          <a download="/sample-data.csv" className="text-blue-500">Sample CSV tanpa username</a>
        </Link>
      </div>
    </div>
  )
}

PersonaPage.redirectUnAuthenticatedTo = ROUTES.Home;
PersonaPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default PersonaPage;
