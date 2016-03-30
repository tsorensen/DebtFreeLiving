# Debt Free Living

Repository for our DGM 2015-2016 Senior Project.

## How to Run this Project Locally

1. Fork the project to your GitHub account
2. Clone the project to your local machine
3. Install dependencies
 * Navigate in your console to the project directory on your local machine
 * Run `npm install` to install dependencies from package.json
 * Run `bower install` to install dependencies from bower.json
4. Run `gulp watch` in your console to serve up the project on `localhost:8000`

## Handling Version Control on this Project
Just a quick overview/cheatsheet on how we should handle the version control on this project.

##### Setup
* Fork the main repository to your own profile
* Clone the repository to your machine `git clone https://github.com/<your username>/DebtFreeLiving.git`
* Set the upstream to the main repository `git remote add upstream https://github.com/tsorensen/DebtFreeLiving.git`
* Check that the upstream has been set `git remote -v`.  More info [here](https://help.github.com/articles/configuring-a-remote-for-a-fork/).

You should now be set.  You can make all the changes/additions you need to on your local copy.  You can also update your local copy at anytime (if you see new commits come through on the main repo in Slack) by fetching the upstream (see below).

##### Committing Changes
When you're ready to commit changes, make sure to fetch the upstream first.

* Fetch the upstream `git fetch upstream`.  
* Make sure you are on your own master branch `git checkout master`.
* Merge the upstream with your master branch `git merge upstream/master`.  This makes sure your copy is up to date on the latest commit in the main repo.  If you have conflicts, you need to resolve them before pushing your own commits (it will tell you if you have conflicts when you do the merge command).  If you need help resolving conflicts just let me know.
* Your local changes should still be there (check by `git status`).
* Add `git add <filename>` or to add all `git add .`, commit `git commit -m"your comment"`, and push `git push`

You should now be able to check your own repo on GitHub.com and see your commits there.

##### Merging to the Main Repository
After you have made all the changes/additions you want on a page or feature, submit them to be merged to the main repo.

* Go to your forked repo on GitHub.com (make sure it's the one under your own profile)
* Click the button "New Pull Request"
* If it says it can't be merged immediately, that's to be expected
* Continue and submit the pull request

Once the pull request is complete, I'll see it and merge it into the main repo master branch.
