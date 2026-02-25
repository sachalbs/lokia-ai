#!/bin/bash
# ============================================================
# GPU Server Optimization — ssh root@51.15.140.134
# Scaleway L4-1-24G | 8 cores | 48GB RAM | 1x L4 24GB VRAM
# Ollama + qwen3:30b already running (~18GB VRAM)
# ============================================================

set -e

echo "=== Lokia AI — GPU Server Optimization ==="

# 1. Check GPU
echo "[1/5] GPU Status:"
nvidia-smi

# 2. Check Ollama
echo ""
echo "[2/5] Ollama Status:"
ollama list

# 3. Optimize Ollama systemd service
echo ""
echo "[3/5] Optimizing Ollama service..."

OLLAMA_SERVICE="/etc/systemd/system/ollama.service.d/override.conf"
mkdir -p /etc/systemd/system/ollama.service.d/

cat > "$OLLAMA_SERVICE" << 'CONF'
[Service]
# Listen on all interfaces (required for VPS to reach this server)
Environment="OLLAMA_HOST=0.0.0.0"
# Allow 4 parallel requests
Environment="OLLAMA_NUM_PARALLEL=4"
# Keep model loaded in VRAM permanently (no cold start)
Environment="OLLAMA_KEEP_ALIVE=-1"
# Max loaded models (we only have 1 GPU with 24GB)
Environment="OLLAMA_MAX_LOADED_MODELS=1"
CONF

echo "Ollama override written to $OLLAMA_SERVICE"
systemctl daemon-reload
systemctl restart ollama

# Wait for Ollama to come back up
echo "Waiting for Ollama to restart..."
sleep 3

# 4. Verify API is accessible
echo ""
echo "[4/5] Verifying API..."
for i in 1 2 3 4 5; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "Ollama API is responding."
        break
    fi
    echo "Waiting... ($i/5)"
    sleep 2
done

# 5. Warm up: make sure qwen3:30b is loaded in VRAM
echo ""
echo "[5/5] Warming up qwen3:30b in VRAM..."
curl -s http://localhost:11434/api/chat \
    -d '{"model": "qwen3:30b", "messages": [{"role": "user", "content": "test"}], "stream": false}' \
    > /dev/null 2>&1 && echo "Model warmed up and loaded in VRAM." || echo "Warning: warmup failed."

echo ""
echo "=== Done ==="
echo "Ollama is optimized and listening on 0.0.0.0:11434"
echo ""
echo "Test from VPS (54.38.243.146):"
echo "  curl http://51.15.140.134:11434/api/chat \\"
echo "    -d '{\"model\": \"qwen3:30b\", \"messages\": [{\"role\": \"user\", \"content\": \"Bonjour !\"}], \"stream\": false}'"
