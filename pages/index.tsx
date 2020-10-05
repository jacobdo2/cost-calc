import { Layout } from "components/Layout";
import Link from "next/link";

const IndexPage = () => (
  <Layout title="Get started">
    <p>
      Go to{" "}
      <Link href={"/profile/create"}>
        <a>Create profile</a>
      </Link>{" "}
      to get started.
      <ul>
        <li> Add existing materials to a profile.</li>
        <li> Enter price per unit next to each of the materials.</li>
        <li> Once done, press "Calculate".</li>
      </ul>
    </p>
  </Layout>
);

export default IndexPage;
