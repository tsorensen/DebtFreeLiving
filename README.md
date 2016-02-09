# Debt Free Living

Repository for our DGM 2015-2016 Senior Project.

### Handling Version Control on this Project
Just a quick overview/cheatsheet from our meeting with Thor on how we should handle the version control on this project.

##### Setup
* Fork the main repository to your own profile
* Clone the repository to your machine `git clone https://github.com/<your username>/DebtFreeLiving.git`
* Set the upstream to the main repository `git remote add upstream https://github.com/tsorensen/DebtFreeLiving.git`
* Check that the upstream has been set `git remote -v`.  More info [here](https://help.github.com/articles/configuring-a-remote-for-a-fork/).

You should now be set.  You can make all the changes/additions you need to on your local copy.  You can also update your local copy at anytime (if you see new commits come through on the main repo in Slack) by fetching the upstream `git fetch upstream`.

##### Committing Changes
When you're ready to commit changes, make sure to fetch the upstream first.

* Fetch the upstream `git fetch upstream`.  This makes sure your copy us up to date on the latest commit in the main repo
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
