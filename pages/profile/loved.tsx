import type { NextPage } from "next";
import Layout from "@components/layout";
import ProudctList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout seoTitle="관심목록" title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
      <ProudctList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;