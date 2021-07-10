import { useRouter } from "next/router";
import Head from "next/head";

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";
import { getCurrentBatch, isAdmin } from "lib/utils";
import useModules from "hooks/useModules";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import SetupModules from "components/project/modules/SetupModules";

const ModulesPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id: pid } = router.query;
  const { project, isError, isLoading, mutate } = useProject(pid);
  const { modules, isError: modulesError, isLoading: modulesLoading } = useModules();

  if (isLoading || modulesLoading) return <div className="my-8 text-center">...</div>;

  if (isError || user.license._id != project.lid) return <ProjectNotFound />

  if (!isAdmin(user, project)) return <ProjectNotFound />

  return (
    <div>
      <Head>
        <title>Setup Modules - ACES</title>
      </Head>

      <Hero project={project} title="ACES Modules" />

      <SetupModules
        user={user}
        modules={modules}
        project={project}
        mutate={mutate}
        batch={getCurrentBatch(project)}
      />
    </div>
  )
}

ModulesPage.redirectUnAuthenticatedTo = ROUTES.Home;
ModulesPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default ModulesPage;
