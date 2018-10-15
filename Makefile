.PHONY: init test clean deploy

REMOTE      := origin
REPO_URI    := git@github.com:stav/timelion.git
REPO_REMOTE := $(shell git remote)
RENDER_DIR  := cowboy:/srv/default/htdocs/timetigr

init:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Initializing

	# Need to init remote:
	# git init --bare

ifeq ($(REPO_REMOTE),)
	@echo Remote is empty
else
	-git remote rm $(REPO_REMOTE)
endif

	git remote add $(REMOTE) $(REPO_URI)
	git fetch $(REMOTE)
	git push $(REMOTE) master
	git branch --set-upstream-to=$(REMOTE)/master master

test:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Testing
	npm test

clean:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Cleaning
	rm -rf ./dist

deploy:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Deploying
	@make test
	@make clean
	npm run build
	scp -r dist/* $(RENDER_DIR)
	git push -u $(REMOTE) master
