"use server";

import { Octokit } from "octokit";
import type { components } from "@octokit/openapi-types";
type PullRequest = components["schemas"]["pull-request"];

export const listRepos = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const response = await octokit.request("GET /users/{owner}/repos", {
    owner: "moexu13",
    per_page: 10,
    sort: "updated",
    direction: "desc",
  });
  return response.data;
};

export const getRepo = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const response = await octokit.request("GET /repos/{owner}/{repo}/contents", {
    owner: "moexu13",
    repo: "moe",
  });
  return response.data;
};

export const getPullRequests = async (formData: FormData) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repo = formData.get("repos") as string;
  const page = parseInt(formData.get("page") as string) || 1;

  // Use the search API to get total count and PRs
  const response = await octokit.request("GET /search/issues", {
    q: `repo:moexu13/${repo} is:pr is:open`,
    per_page: 10,
    page: page,
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  // Get detailed info for each PR
  const prsWithDetails = await Promise.all(
    response.data.items.map(async (pr: any) => {
      const details = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
        owner: "moexu13",
        repo: repo,
        pull_number: pr.number,
      });
      return details.data;
    })
  );

  return {
    pullRequests: prsWithDetails,
    totalCount: response.data.total_count,
    currentPage: page,
    hasNextPage: response.data.items.length === 10,
  };
};
