.PHONY: init test clean deploy

REPO_NAME    = timelion
REPO_URI    := stav@cowboy:/srv/git/$(REPO_NAME).git
REPO_REMOTE := $(shell git remote)
SOURCE_DIR  := `ls | grep -v .git`
RENDER_DIR  := cowboy:/srv/default/htdocs/life

init:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Initializing
ifeq ($(strip $(REPO_REMOTE)),)
	@echo Remote is empty
else
	-git remote rm origin
endif
	git remote add origin $(REPO_URI)
	git fetch
	git branch --set-upstream-to=origin/master master

test:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Testing
	@echo Tests passed

clean:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Cleaning

deploy:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Deploying
	@make test
	@make clean
	scp -r  $(SOURCE_DIR)  $(RENDER_DIR)
	git push -u origin master
