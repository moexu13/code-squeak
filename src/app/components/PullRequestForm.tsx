"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { getPullRequests } from "../utils/actions";
import type { components } from "@octokit/openapi-types";
import PullRequestDetail from "./PullRequestDetail";
type Repo = components["schemas"]["repository"];
type PullRequest = components["schemas"]["pull-request"];

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-tertiary)"
      disabled={pending}
    >
      {pending ? "Loading..." : "Get Pull Requests"}
    </button>
  );
};

const PullRequestForm = ({ initialRepos }: { initialRepos: Repo[] }) => {
  const [selectedRepo, setSelectedRepo] = useState(initialRepos[0]?.name || "");
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("repos", selectedRepo);
      const prs = await getPullRequests(formData);
      setPullRequests(prs as PullRequest[]);
    } catch (err) {
      setError("Failed to fetch pull requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <select
          className="w-full p-2 border rounded-md"
          name="repos"
          value={selectedRepo}
          onChange={(e) => {
            setSelectedRepo(e.target.value);
            setPullRequests([]);
          }}
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

      {pullRequests.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Pull Requests for {selectedRepo}</h2>
          <ul>
            {pullRequests.map((pullRequest) => (
              <PullRequestDetail key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </ul>
        </section>
      )}

      {pullRequests.length === 0 && selectedRepo && !loading && (
        <p className="mt-4">No open pull requests found for {selectedRepo}</p>
      )}

      {/* TODO: fix accessibility */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </>
  );
};

export default PullRequestForm;
