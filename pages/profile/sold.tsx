import type { NextPage } from "next";
import Layout from "@components/layout";
import ProudctList from "@components/product-list";


const Sold: NextPage = () => {
  return (
    <Layout seoTitle="판매내역" title="판매내역" canGoBack>
        <div className="flex flex-col space-y-5 pb-10  divide-y">
      <ProudctList kind="sales" />
    </div>
  </Layout>
);
};
export default Sold;