import type { NextPage } from "next";
import Layout from "@components/layout";
import ProudctList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
      <ProudctList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;