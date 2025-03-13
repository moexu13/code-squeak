import { getPullRequests } from "./utils/actions";

const Home = async () => {
  const pullRequests = await getPullRequests();
  return (
    <main className="min-h-screen p-8">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CodeSqueak</h1>
        
        <form className="space-y-4">
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium mb-2"
            >
              Your Code
            </label>
            <textarea
              id="code-snippet"
              name="code-snippet"
              rows={4}
              className="w-full p-2 border rounded-md font-mono"
              placeholder="Enter your code snippet here..."
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-tertiary)"
          >
            Submit
          </button>
        </form>
      </section>
      <section className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Output</h2>
        <div>
          <p className="font-mono">{pullRequests.map((pr: { title: string }) => pr.title)}</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
