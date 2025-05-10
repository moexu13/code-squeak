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

  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: "moexu13",
    repo: repo,
    state: "open",
    per_page: 10,
    page: page,
  });

  // Get detailed info for each PR
  const prsWithDetails = await Promise.all(
    response.data.map(async (pr: PullRequest) => {
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
    totalCount: response.data.length, // We'll use the length of the current page
    currentPage: page,
    hasNextPage: response.data.length === 10,
  };
};
