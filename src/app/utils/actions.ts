"use server";

import { Octokit } from "octokit";

export const getRepo = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const response = await octokit.request("GET /repos/{owner}/{repo}/contents", {
    owner: "moexu13",
    repo: "moe",
  });
  return response.data;
};
