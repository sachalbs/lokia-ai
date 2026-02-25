#!/bin/bash
# ============================================================
# GPU Server Setup — 51.15.140.134 (L4 24GB)
# ============================================================
# Ollama is already installed with qwen3:30b.
# This script helps verify and optimize the setup.
# ============================================================

set -e

echo "=== Lokia AI — GPU Server Check ==="

# Check NVIDIA GPU
echo "[1/4] GPU Status:"
nvidia-smi

# Check Ollama
echo ""
echo "[2/4] Ollama Status:"
if command -v ollama &> /dev/null; then
    echo "Ollama is installed."
    ollama list
else
    echo "ERROR: Ollama not found. Install with: curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

# Check if qwen3:30b is loaded
echo ""
echo "[3/4] Checking qwen3:30b model..."
if ollama list | grep -q "qwen3"; then
    echo "qwen3:30b is available."
else
    echo "Pulling qwen3:30b..."
    ollama pull qwen3:30b
fi

# Verify Ollama is listening on all interfaces
echo ""
echo "[4/4] Verifying API accessibility..."

# Check if Ollama is bound to 0.0.0.0 (needed for remote access from VPS)
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "Ollama API is responding on localhost."
else
    echo "WARNING: Ollama API is not responding. Start it with: ollama serve"
fi

echo ""
echo "=== Optimization Tips ==="
echo ""
echo "1. Make sure Ollama listens on 0.0.0.0 (not just localhost):"
echo "   Edit /etc/systemd/system/ollama.service and add:"
echo "     Environment=\"OLLAMA_HOST=0.0.0.0\""
echo "   Then: sudo systemctl daemon-reload && sudo systemctl restart ollama"
echo ""
echo "2. Allow parallel requests:"
echo "   Add to ollama.service:"
echo "     Environment=\"OLLAMA_NUM_PARALLEL=4\""
echo ""
echo "3. Keep model loaded in VRAM (avoid cold starts):"
echo "   Add to ollama.service:"
echo "     Environment=\"OLLAMA_KEEP_ALIVE=-1\""
echo ""
echo "4. Test from VPS (54.38.243.146):"
echo "   curl http://51.15.140.134:11434/api/chat \\"
echo "     -d '{\"model\": \"qwen3:30b\", \"messages\": [{\"role\": \"user\", \"content\": \"Bonjour !\"}], \"stream\": false}'"
