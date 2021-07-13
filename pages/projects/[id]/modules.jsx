import Head from "next/head";
import { useRouter } from "next/router";

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import Modules from "components/project/modules/Modules";

const ModulesPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id: pid } = router.query;

  const { project, isError, isLoading } = useProject(pid);

  if (isLoading) return <div className="my-8 text-center">...</div>;
  if (isError) return <>-----ERROR-----</>;
  if (user.license._id != project.lid) return <ProjectNotFound />

  return (
    <div>
      <Head>
        <title>{project.title} - ACES</title>
      </Head>

      <Hero project={project} title="ACES Modules" />

      <Modules user={user} project={project} />
    </div>
  )
}

ModulesPage.redirectUnAuthenticatedTo = ROUTES.Home;
ModulesPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default ModulesPage;
