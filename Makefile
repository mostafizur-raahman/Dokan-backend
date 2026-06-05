serverLocation := ./src/server.js
serverName := dokan-backend
imageName := dokan_backend
dockerUserName := mostafizurrahman24

.PHONY: run hard-run stop delete restart logs status list help


build:
	@docker build -t ${dockerUserName}/${imageName}:latest .
push: 
	@docker push ${dockerUserName}/${imageName}:latest
	
nodemon:
	@nodemon $(serverLocation)

run:
	@pm2 start $(serverLocation) -i max --name $(serverName)

stop:
	@pm2 stop $(serverName) || true  

delete:
	@pm2 delete $(serverName) || true

restart: stop run

logs:
	@pm2 logs $(serverName)

status:
	@pm2 list | grep $(serverName) || echo "❌ $(serverName) is not running"

list:
	@pm2 list

help:
	@echo "📋 Available commands:"
	@echo "  make run       - Start server (PM2)"
	@echo "  make hard-run  - Start with nodemon (dev)"
	@echo "  make stop      - Stop server"
	@echo "  make delete    - Remove from PM2"
	@echo "  make restart   - Stop & Start"
	@echo "  make logs      - View PM2 logs"
	@echo "  make status    - Check if running"
	@echo "  make list      - Show all PM2 apps"
	@echo "  make help      - Show this help"