import type { components } from "@octokit/openapi-types";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type PullRequest = components["schemas"]["pull-request"];
const PullRequest = ({ pullRequest }: { pullRequest: PullRequest }) => {
  console.log("Pull Request Data:", pullRequest);

  return (
    <li key={pullRequest.id} className="p-4 border rounded-md space-y-2">
      <Link
        href={pullRequest.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:underline block mb-1"
      >
        <h3 className="text-lg">{pullRequest.title}</h3>
      </Link>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-200">
          #{pullRequest.number} opened by {pullRequest.user?.login} • {pullRequest.comments}{" "}
          comments • {pullRequest.additions ?? 0}+ {pullRequest.deletions ?? 0}-
        </p>
        <div className="text-sm text-gray-100 prose prose-invert max-w-none">
          {(ReactMarkdown as any)({ children: pullRequest.body?.slice(0, 150) + "..." })}
        </div>
        <div className="text-xs text-gray-300">
          Created: {new Date(pullRequest.created_at).toLocaleDateString()} • Updated:{" "}
          {new Date(pullRequest.updated_at).toLocaleDateString()}
        </div>
      </div>
    </li>
  );
};

export default PullRequest;
