#!/usr/bin/env bash

##  Do not `post-checkout` when checking out a single file
##
if [[ "$( basename "${0}" )" == "post-checkout" && "${3}" == "0" ]] ; then
    exit
fi

changed_files="$(git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD)"

function changed
{
    echo "${changed_files}" | grep --quiet "${1}"
}

if changed package-lock.json ; then
    npm run refresh
fi
