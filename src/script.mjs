// @ts-check

import shell from "shelljs";
import { existsSync } from "fs";


const tsExec = (cmd, opts) => {
  const result = shell.exec(cmd, { cwd: "TypeScript", ...opts })
  const canSafelyFail = opts && opts.failable 
  if (result.stderr.length && !canSafelyFail) {
    console.error("Got stderr from command: " + cmd)
    console.error(result.stderr)
  }
  return result
}

export const getGitTags = () => tsExec("git tag", {silent: true}).stdout.split("\n").filter(Boolean);

export const cloneIfNeeded = () => {
  if (!existsSync("TypeScript")) {
    shell.exec("git clone https://github.com/microsoft/TypeScript");
    tsExec("git config advice.detachedHead")
  } else {
    const isCI = process.env.CI
    const lastCommitUnixTime = Number(tsExec("git log -1 --pretty=format:%ct", {silent: true}).stdout.trim())

    const hasBeenTenMins = (new Date().valueOf() - 60 * 60) > lastCommitUnixTime
    // console.log(new Date().valueOf() - 60 * 60, lastCommitUnixTime)
    if (isCI || hasBeenTenMins) {
      tsExec("git stash", {failable: true});
      tsExec("git checkout master", {failable: true});
      tsExec("git pull origin master", {failable: true});
    } 
  }

  // So that we have something to benchmark against
  if (!existsSync("ant-design")) {
    shell.exec("git clone https://github.com/ant-design/ant-design.git");
    shell.exec("npm i", { cwd: "ant-design"});
  }
};

const getCommits = (from, to) => {
  /**
   * Look like:

  f646ec87fc fix(40901): skip checking custom arguments name in a constructor (#40912)
  373b352333 Rename 'compat' to 'deprecatedCompat'. (#41000)
  075477f9cf fix(35779): emit comments after trailing comma (#37887)
  ae81add083 Separate delete-all-imports from other delete-all (#41105)
  9adf2f84e2 Merge branch 'master'
   */
  const list = tsExec(`git rev-list ${from}..${to} --oneline`, { silent: true }).stdout.split("\n").filter(Boolean); 
  const prMergeCommits = list.filter(c => c.includes("(#") && c.endsWith(")")).map(c => c.split(" ")[0])
  return prMergeCommits
}

export const run = async (from, to) => {
  cloneIfNeeded();
  process.stdout.write(`Looking at commits from ${from} to ${to}, `)

  const commits = getCommits(from, to)
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0); 
  
  console.log(`Looking at commits from ${from} to ${to} - ${commits.length} commits`)
  const data = getDataForCommit(commits[0])
  console.log(JSON.stringify(data, null, "  "))
}

/** @param ref {string} */
export const getDataForCommit = (ref) => {
  process.stdout.write(`\nChecked out at ${ref}: `)
  // So we don't get inline errors
  tsExec(`git -c advice.detachedHead=false checkout ${ref}`)

  // tsExec(`npm ci`) slower but more consistent?
  tsExec(`npm install`)

  tsExec(`gulp tsc`)
  const runs = []
  let errors = 0
  
  for (let i = 0; i <= 4; i++) {
    process.stdout.write(`${i+1}${i === 4 ? "" : ", "}`)
    const start = (new Date()).valueOf()
    const run = shell.exec("node ./TypeScript/built/local/tsc.js -p ant-design")
    errors = run.stdout.split(": error TS").length - 1
    const end = (new Date()).valueOf()
    const length = end - start
    runs.push({ end, start, length })
  }
  
  const stats = {
    max: 0,
    min: Infinity,
    avg: 0
  }

  runs.forEach(r => {
    if (r.length > stats.max) stats.max = r.length
    if (r.length < stats.min) stats.min = r.length
    stats.avg += r.length
  })
  stats.avg /= runs.length
  
  console.log("")
  const data = {
    ref,
    errors,
    runs,
    stats
  }

  return data
}
