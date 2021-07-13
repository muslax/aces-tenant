import Head from "next/head";
import { useRouter } from "next/router";

import { APIROUTES, ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import useProject from "hooks/useProject";

import ProjectNotFound from "components/project/ProjectNotFound";
import ProjectLayout from "components/layout/ProjectLayout";
import Hero from "components/project/Hero";
import Overview from "components/project/overview/Overview";
import Prefetch from "components/Prefetch";

const prefetchFields='fullname,username,email,gender,birth,phone,group,nip,position,currentLevel,targetLevel';

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id: pid } = router.query;
  const { project, isError, isLoading, mutate } = useProject(pid);

  if (isLoading) return <div className="my-8 text-center">...</div>;
  if (isError) return <>-----ERROR-----</>;
  if (user.license._id != project.lid) return <ProjectNotFound />


  return (
    <div>
      <Head>
        <title>{project.title} - ACES</title>
      </Head>

      <Hero project={project} isIndex={true} />

      {/* <div className="py-7 border--b">
        <h2 className="text-3xl text-green--600 font--semibold truncate">{project.title}</h2>
        <div className="text-base text-gray-500 font-medium">{project.client.name}, {project.client.city}</div>
      </div> */}

      <Overview user={user} project={project} mutate={mutate} />

      {project.batches.map(({ _id }) => <div key={_id}>
        <Prefetch uri={`${APIROUTES.GET.BATCH_PERSONAE}&bid=${_id}&fields=${prefetchFields}`} />
        <Prefetch uri={`${APIROUTES.GET.BATCH_GROUPS}&bid=${_id}`} />
      </div>)}

      {/* <Prefetch uri={`${APIROUTES.GET.MODULES}`} /> */}

      {/* <pre>PROJECT {JSON.stringify(project, null, 2)}</pre> */}
    </div>
  )
}

ProjectPage.redirectUnAuthenticatedTo = ROUTES.Home;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>

export default ProjectPage;

/*
export async function getStaticPaths() {
  const { dba } = await connect();
  const projects = await dba.collection(DB.PROJECTVIEW).find().toArray();
  const paths = projects.map((project) => ({
    params: { id: project._id }
  }));

  console.log(paths);
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { dba } = await connect();
  const rs = await dba.collection(DB.PROJECTVIEW).findOne({ _id: params.id });
  const project = JSON.parse(JSON.stringify(rs));

  return {
    props: {
      project,
    },
    revalidate: 30, // In 30 seconds
  }
}
*/