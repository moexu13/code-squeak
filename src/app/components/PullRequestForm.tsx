"use client";

import { useState, useEffect } from "react";
import { getPullRequests } from "../utils/actions";
import type { components } from "@octokit/openapi-types";
import PullRequestDetail from "./PullRequestDetail";
import PaginationControls from "./PaginationControls";

type Repo = components["schemas"]["repository"];
type PullRequest = components["schemas"]["pull-request"];

const PullRequestForm = ({ initialRepos }: { initialRepos: Repo[] }) => {
  const [selectedRepo, setSelectedRepo] = useState(initialRepos[0]?.name || "");
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchPullRequests = async (repo: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("repos", repo);
      formData.append("page", page.toString());
      const result = await getPullRequests(formData);
      setPullRequests(result.pullRequests);
      setTotalCount(result.totalCount);
      setCurrentPage(result.currentPage);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      setError("Failed to fetch pull requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch PRs when component mounts and when repo changes
  useEffect(() => {
    if (selectedRepo) {
      setCurrentPage(1);
      fetchPullRequests(selectedRepo, 1);
    }
  }, [selectedRepo]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (newPage <= Math.ceil(totalCount / 10) || hasNextPage)) {
      setCurrentPage(newPage);
      fetchPullRequests(selectedRepo, newPage);
    }
  };

  return (
    <>
      <form className="space-y-4">
        <select
          className="w-full p-2 border rounded-md"
          name="repos"
          value={selectedRepo}
          onChange={(e) => {
            setSelectedRepo(e.target.value);
            setPullRequests([]);
            setCurrentPage(1);
          }}
        >
          {initialRepos.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
      </form>

      {loading && <p className="mt-4">Loading pull requests...</p>}

      {pullRequests.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Pull Requests for {selectedRepo}</h2>
          <ul className="space-y-4">
            {pullRequests.map((pullRequest) => (
              <PullRequestDetail key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </ul>

          <PaginationControls
            currentPage={currentPage}
            totalCount={totalCount}
            loading={loading}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
          />
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
