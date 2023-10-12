import Head from "next/head"
import { GetServerSidePropsResult } from "next"
import { DrupalNode } from "next-drupal"

import { cacheAwareStore } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"

interface IndexPageProps {
  nodes: DrupalNode[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeArticleTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}

// Using SSR so that page will be re-rendered when edge cache is purged
export async function getServerSideProps(
  context
): Promise<GetServerSidePropsResult<{ nodes: unknown; }>> { // TODO: Type could be improved here
  const params = new URLSearchParams();
  params.append('filter[status]', '1');
  params.append('fields[node--article]', 'title,path,field_image,uid,created');
  params.append('include', 'field_image,uid');
  params.append('sort', '-created');

  // Provides a similar dataset to Next for Drupal client and automatically
  // bubbles up Pantheon compatible edge cache keys (Surrogate-Key header)
  const nodes = await cacheAwareStore.getObject({
		objectName: 'node--article',
		res: context.res,
    params: params.toString(),
    refresh: true,
	});

  return {
    props: {
      nodes,
    },
  }
}
