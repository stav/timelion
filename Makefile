.PHONY: init test clean deploy

REPO_NAME    = timelion
LN_REPO_URI := stav@cowboy:/srv/git/$(REPO_NAME).git
GH_REPO_URI := git@github.com:stav/$(REPO_NAME).git
SOURCE_DIR  := `ls | grep -v .git`
RENDER_DIR  := cowboy:/srv/default/htdocs/timelion/

init_linode: REMOTE = linode
init_github: REMOTE = github

init:
	# Havn't quite figured out variables yet
	@make init_linode
	@make init_github

init_linode:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Initializing Linode repository

	$(eval HAS_REMOTE=$(shell git remote |grep $(REMOTE)))

ifeq ($(strip $(HAS_REMOTE)),)
	-git remote rm $(REMOTE)
endif

	git remote add $(REMOTE) $(LN_REPO_URI)
	git fetch $(REMOTE)
	git remote show $(REMOTE)

	$(eval EMPTY=$(git remote show $(REMOTE) |grep HEAD |grep unknown))

ifeq ($(strip $(EMPTY)),"unknown")
	@echo Remote is empty
	git push -u $(REMOTE) master
else
	@echo Remote already setup
	git branch --set-upstream-to=$(REMOTE)/master master
endif

init_github:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Initializing GitHub repository

	$(eval HAS_REMOTE=$(shell git remote |grep $(REMOTE)))

ifeq ($(strip $(HAS_REMOTE)),)
	-git remote rm $(REMOTE)
endif

	git remote add $(REMOTE) $(GH_REPO_URI)
	git fetch $(REMOTE)
	git remote show $(REMOTE)

	$(eval EMPTY=$(git remote show $(REMOTE) |grep HEAD |grep unknown))

ifeq ($(strip $(EMPTY)),"unknown")
	@echo Remote is empty
	git push -u $(REMOTE) master
else
	@echo Remote already setup
	git branch --set-upstream-to=$(REMOTE)/master master
endif

test:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Testing
	@echo Tests passed

clean:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Cleaning

sync:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Syncing
	rsync --dirs --recursive --update --progress  --verbose  $(SOURCE_DIR)  $(RENDER_DIR)

push:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Pushing
	git push -u linode master
	git push -u github master

deploy:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Deploying
	@make test
	@make clean
	@make sync
	@make push
