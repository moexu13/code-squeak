"use server";

import { Octokit } from "octokit";

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
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: "moexu13",
    repo: String(formData.get("repos")),
    state: "open",
  });
  return response.data;
};
