.PHONY: help prod-local prod-ovh dev test health logs stop restart clean

help:
	@echo "🚀 Portfolio Deployment Commands"
	@echo ""
	@echo "Production:"
	@echo "  make prod-local    - Deploy in production mode (localhost)"
	@echo "  make prod-ovh      - Deploy to OVH production"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development mode"
	@echo ""
	@echo "Testing & Monitoring:"
	@echo "  make health        - Check backend health"
	@echo "  make test-contact  - Test contact form endpoint"
	@echo "  make logs          - View all logs (follow mode)"
	@echo "  make logs-backend  - View backend logs only"
	@echo ""
	@echo "Service Management:"
	@echo "  make restart       - Restart all services"
	@echo "  make stop          - Stop all services"
	@echo "  make clean         - Stop and remove containers"
	@echo ""

prod-local:
	@echo "🚀 Deploying to production (localhost)..."
	docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
	docker-compose -f docker-compose.prod.yml up --build -d
	@sleep 3
	@echo "✅ Production deployed!"
	@echo "📊 Services:"
	@echo "  - Backend:  http://localhost:5000"
	@echo "  - Frontend: http://localhost:3000"

prod-ovh:
	@echo "☁️ Deploying to OVH production..."
	@if [ ! -f "backend/.env.production.ovh" ]; then \
		echo "❌ File not found: backend/.env.production.ovh"; \
		echo "Please create and configure the OVH environment file."; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
	docker-compose -f docker-compose.prod.yml up --build -d
	@sleep 5
	@echo "✅ OVH production deployed!"
	@echo "⚠️ Make sure SSL certificates are configured in nginx.conf.prod"

dev:
	@echo "🔧 Starting development mode..."
	npm run dev

health:
	@echo "🏥 Checking backend health..."
	@curl -s http://localhost:5000/api/health | jq . || echo "❌ Backend not responding"

test-contact:
	@echo "📧 Testing contact form..."
	@curl -X POST http://localhost:5000/api/contact/submit \
		-H "Content-Type: application/json" \
		-d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}' | jq .

logs:
	@docker-compose -f docker-compose.prod.yml logs -f

logs-backend:
	@docker logs portfolio-backend-1 -f

restart:
	@echo "🔄 Restarting services..."
	docker-compose -f docker-compose.prod.yml restart
	@echo "✅ Services restarted"

stop:
	@echo "🛑 Stopping services..."
	docker-compose -f docker-compose.prod.yml stop
	@echo "✅ Services stopped"

clean:
	@echo "🧹 Cleaning up..."
	docker-compose -f docker-compose.prod.yml down -v
	@echo "✅ Cleanup complete"

ps:
	@echo "📋 Running containers:"
	@docker ps

stats:
	@echo "📊 Container stats:"
	@docker stats
