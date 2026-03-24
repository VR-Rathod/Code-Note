# Bugfix Requirements Document

## Introduction

Vercel deployments of the Quartz 4 static site complete successfully but end with
"Skipping cache upload because no files were prepared" and "Previous build caches not
available". No cache directories are declared to Vercel, so the build cache is never
saved or restored between deployments. This causes every deployment to start cold,
re-downloading dependencies and re-transpiling the Quartz build pipeline from scratch,
increasing build times unnecessarily.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a Vercel deployment runs the Quartz build THEN the system completes the build
    without declaring any cache paths, causing Vercel to log "Skipping cache upload
    because no files were prepared"

1.2 WHEN a subsequent Vercel deployment starts THEN the system has no previously saved
    cache, causing Vercel to log "Previous build caches not available" and perform a
    full cold build

### Expected Behavior (Correct)

2.1 WHEN a Vercel deployment runs the Quartz build THEN the system SHALL declare the
    `node_modules` and `.quartz-cache` directories as cache paths so Vercel saves them
    after the build completes

2.2 WHEN a subsequent Vercel deployment starts THEN the system SHALL restore the cached
    `node_modules` and `.quartz-cache` directories, avoiding redundant dependency
    installation and build transpilation

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the Quartz build runs with a warm cache THEN the system SHALL CONTINUE TO
    produce the same static output as a cold build

3.2 WHEN the Vercel deployment completes THEN the system SHALL CONTINUE TO serve the
    site correctly with all pages, assets, and routes intact

3.3 WHEN the content files change between deployments THEN the system SHALL CONTINUE TO
    reflect those changes in the deployed output regardless of cache state
