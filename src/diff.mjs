#!/usr/bin/env node
// @ts-check

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
// @ts-ignore
import { run,getGitTags } from './script.mjs'

yargs(hideBin(process.argv))
  .command('head', 'Generate a CSV of the difference between head and the last release', () => { }, (argv) => {
    const tags = getGitTags() 
    const latest = tags.pop()
    run(latest, "master")
  })

  .command('latest', 'Generate a CSV of the difference between the latest two releases', () => {}, (argv) => {
    const tags = getGitTags().filter(r => !r.includes("-")) 
    const latest = tags.pop()
    const secondLatest = tags.pop()
    run(secondLatest, latest)
  })

  .command('run <from> <to>', 'Generate a CSV of the times a compile took for each commit', () => {}, (argv) => {
    console.info(argv)
    run(argv.from, argv.to)
  })

  .demandCommand(2)
  .argv
