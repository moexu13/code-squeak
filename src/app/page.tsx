import Image from "next/image";
import { listRepos } from "./utils/actions";
import PullRequestForm from "./components/PullRequestForm";
const Home = async () => {
  const repos = await listRepos();

  return (
    <main className="min-h-screen p-8">
      <section className="max-w-2xl mx-auto">
        <div className="flex items-center mb-2">
          <Image
            src="/squeak.png"
            alt="Line drawing of a cute cartoon rat"
            width={100}
            height={100}
          />
          <h1 className="text-3xl font-bold">CodeSqueak</h1>
        </div>
        <p className="mb-2">
          GitHub Repository Owner - <span className="font-mono">moexu13</span>
        </p>
        <PullRequestForm initialRepos={repos} />
      </section>
    </main>
  );
};

export default Home;
