import { LANGUAGE_VERSIONS } from "./constants";

const baseURL = "https://emkc.org/api/v2/piston";

export const executeCode = async (language, sourceCode, input) => {
  const response = await fetch(`${baseURL}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
      stdin: input
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok' + response.statusText);
  }

  const data = await response.json();
  return data;
};
