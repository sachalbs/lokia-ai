#!/bin/bash
# ============================================================
# GPU Server Setup Script — Run on: 51.15.140.134 (L4 24GB)
# ============================================================
# This script installs Docker, NVIDIA drivers, and starts vLLM.
# Run as: sudo bash setup.sh
# ============================================================

set -e

echo "=== Lokia AI — GPU Server Setup ==="
echo "Target: NVIDIA L4 24GB with Qwen2.5-32B-Instruct-AWQ"
echo ""

# 1. Update system
echo "[1/5] Updating system..."
apt-get update && apt-get upgrade -y

# 2. Install NVIDIA drivers (if not already installed)
if ! command -v nvidia-smi &> /dev/null; then
    echo "[2/5] Installing NVIDIA drivers..."
    apt-get install -y nvidia-driver-535 nvidia-utils-535
    echo "NVIDIA drivers installed. A REBOOT may be required."
else
    echo "[2/5] NVIDIA drivers already installed."
    nvidia-smi
fi

# 3. Install Docker
if ! command -v docker &> /dev/null; then
    echo "[3/5] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "[3/5] Docker already installed."
fi

# 4. Install NVIDIA Container Toolkit
if ! dpkg -l | grep -q nvidia-container-toolkit; then
    echo "[4/5] Installing NVIDIA Container Toolkit..."
    curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
        gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
    curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
        sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
        tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
    apt-get update
    apt-get install -y nvidia-container-toolkit
    nvidia-ctk runtime configure --runtime=docker
    systemctl restart docker
else
    echo "[4/5] NVIDIA Container Toolkit already installed."
fi

# 5. Start vLLM
echo "[5/5] Starting vLLM with Qwen2.5-32B-Instruct-AWQ..."
cd "$(dirname "$0")"
docker compose up -d

echo ""
echo "=== Setup Complete ==="
echo "vLLM is starting. First launch downloads the model (~18GB)."
echo "Check status with: docker logs -f lokia-vllm"
echo "API will be available at: http://$(hostname -I | awk '{print $1}'):8080/v1"
echo ""
echo "Test with:"
echo '  curl http://localhost:8080/v1/chat/completions \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '\''{"model": "Qwen/Qwen2.5-32B-Instruct-AWQ", "messages": [{"role": "user", "content": "Bonjour !"}], "max_tokens": 100}'\'''
