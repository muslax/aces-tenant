import Head from "next/head";
import { useRouter } from "next/router";

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import ImportCSV from "components/project/persona/ImportCSV";

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

      <Hero project={project} title="Import CSV" />

      <ImportCSV user={user} project={project} />

      {/* <pre>PROJECT {JSON.stringify(project, null, 2)}</pre> */}
    </div>
  )
}

PersonaPage.redirectUnAuthenticatedTo = ROUTES.Home;
PersonaPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default PersonaPage;
