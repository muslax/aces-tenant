import Head from "next/head";
import { useRouter } from "next/router";

import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import Overview from "components/project/overview/Overview";
import useBatches from "hooks/useBatches";

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id: pid } = router.query;
  const { project, isError, isLoading, mutate } = useProject(pid);
  const { batches, isLoading: bLoading, isError: bError, mutate: mutateBatches } = useBatches (pid);

  if (isLoading || bLoading) return <div className="my-8 text-center">...</div>;
  if (isError || bError) return <>ERROR</>;

  if (user.license._id != project.lid) return <ProjectNotFound />

  return (
    <div>
      <Head>
        <title>{project.title} - ACES</title>
      </Head>


      <pre>PROJECT {JSON.stringify(project, null, 2)}</pre>
    </div>
  )
}

ProjectPage.redirectUnAuthenticatedTo = ROUTES.Home;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default ProjectPage;
