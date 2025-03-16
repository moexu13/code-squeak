"use client";

import { useState } from "react";
import { getPullRequests } from "../utils/actions";
import type { components } from "@octokit/openapi-types";

// Define types using Octokit components
type Repo = components["schemas"]["repository"];
type PullRequest = components["schemas"]["pull-request"];

const PullRequestForm = ({ initialRepos }: { initialRepos: Repo[] }) => {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(initialRepos[0]?.name || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const submittedRepo = formData.get("repos") as string;
    setSelectedRepo(submittedRepo);

    try {
      // Call the server action with form data
      const prs = await getPullRequests(formData);
      setPullRequests(prs as PullRequest[]);
    } catch (error) {
      console.error("Error fetching pull requests:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="space-y-4" action={handleSubmit}>
        <select 
          className="w-full p-2 border rounded-md" 
          name="repos"
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
        >
          {initialRepos.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-tertiary)"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Pull Requests"}
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Pull Requests</h2>
        <ul className="space-y-2">
          {pullRequests.map((pr) => (
            <li key={pr.id} className="p-3 border rounded-md">
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {pr.title}
              </a>
              <p className="text-sm text-gray-400">
                #{pr.number} opened by {pr.user?.login}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default PullRequestForm;
