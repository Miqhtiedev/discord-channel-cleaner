import fs from "fs";

let flaggedTerms: string[] = [];

export const populateFlaggedTerms = (filePath: string) => {
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  flaggedTerms = content.split("\n").map((w) => w.toLowerCase()).filter((w) => w.charAt(0) !== "#");
};

export const containsFlaggedTerm = (str: string) => {
  const split = str.split(/\s+/).map((w) => w.toLowerCase());

  for (const word of split) {
    if (flaggedTerms.includes(word.toLowerCase())) {      
      return true;
    }
  }

  return false;
};
